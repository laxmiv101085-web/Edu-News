import { Job } from 'bullmq';
import { PrismaClient, ItemType } from '@prisma/client';
import Redis from 'ioredis';
import OpenAI from 'openai';

// LLM Adapter
class LlmAdapter {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async extractEntities(text: string): Promise<any> {
    if (this.client) {
      return this.extractWithOpenAI(text);
    }
    return this.extractWithMock(text);
  }

  private async extractWithOpenAI(text: string): Promise<any> {
    const prompt = `Given this notice text: "${text}", extract exam_name, institution, start_date, last_date (YYYY-MM-DD or null), important_deadline, and a 1-line short summary (<=40 words) and a 2-3 sentence long summary (<=150 words). Return JSON with keys: exam_name, institution, start_date, last_date, deadlines (array), short_summary, long_summary, tags (array of relevant tags). If date is ambiguous, return best_guess and reason.`;

    try {
      const response = await this.client!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that extracts structured information from educational notices. Always return valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.0,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI extraction error:', error);
      return this.extractWithMock(text);
    }
  }

  private extractWithMock(text: string): any {
    const words = text.split(/\s+/);
    const shortSummary = words.slice(0, 40).join(' ') + (words.length > 40 ? '...' : '');
    const longSummary = words.slice(0, 150).join(' ') + (words.length > 150 ? '...' : '');

    const commonTags = ['exam', 'scholarship', 'result', 'admission', 'notification'];
    const tags = commonTags.filter(tag => text.toLowerCase().includes(tag));

    const examPatterns = /(JEE|NEET|UPSC|SSC|GATE|CAT|MAT|XAT|CLAT|AILET|NTA|CBSE|ICSE|State Board)/gi;
    const examMatches = text.match(examPatterns);
    const examName = examMatches ? examMatches[0] : undefined;

    const datePattern = /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/g;
    const dates = text.match(datePattern) || [];
    const lastDate = dates.length > 0 ? dates[dates.length - 1] : undefined;

    return {
      exam_name: examName,
      institution: undefined,
      start_date: undefined,
      last_date: lastDate,
      deadlines: dates,
      short_summary: shortSummary,
      long_summary: longSummary,
      tags: tags.length > 0 ? tags : ['educational', 'notice'],
    };
  }
}

const llmAdapter = new LlmAdapter();

export function ProcessingProcessor(prisma: PrismaClient, redis: Redis) {
  return async (job: Job) => {
    const { rawItemId, sourceId } = job.data;
    
    console.log(`Processing item ${rawItemId}`);
    
    const rawItem = await prisma.rawItem.findUnique({
      where: { id: rawItemId },
      include: { source: true },
    });

    if (!rawItem) {
      throw new Error('Raw item not found');
    }

    const itemData = rawItem.rawJson as any;
    const text = `${itemData.title} ${itemData.body}`;

    // Extract entities using LLM
    const extracted = await llmAdapter.extractEntities(text);

    // Determine item type
    let itemType: ItemType = ItemType.OTHER;
    const lowerText = text.toLowerCase();
    if (lowerText.includes('exam') || lowerText.includes('entrance')) {
      itemType = ItemType.EXAM;
    } else if (lowerText.includes('scholarship')) {
      itemType = ItemType.SCHOLARSHIP;
    } else if (lowerText.includes('result')) {
      itemType = ItemType.RESULT;
    } else if (lowerText.includes('admission')) {
      itemType = ItemType.ADMISSION;
    }

    // Compute dedupe hash
    const dedupeHash = computeDedupeHash(itemData);

    // Create processed item
    const item = await prisma.item.create({
      data: {
        title: itemData.title,
        body: itemData.body,
        publishedAt: itemData.publishedAt ? new Date(itemData.publishedAt) : new Date(),
        url: itemData.url,
        sourceId,
        type: itemType,
        tags: extracted.tags || [],
        shortSummary: extracted.short_summary || '',
        longSummary: extracted.long_summary || '',
        dedupeHash,
        extractedEntities: {
          examName: extracted.exam_name,
          institution: extracted.institution,
          startDate: extracted.start_date,
          lastDate: extracted.last_date,
          deadlines: extracted.deadlines || [],
        },
      },
    });

    // Match against alert rules and queue notifications
    await matchAndQueueNotifications(prisma, redis, item);

    return { itemId: item.id };
  };
}

async function matchAndQueueNotifications(prisma: PrismaClient, redis: Redis, item: any) {
  const alertRules = await prisma.alertRule.findMany({
    where: {
      active: true,
      minTrustLevel: { lte: item.source.trustLevel },
    },
    include: { user: true },
  });

  const { Queue } = await import('bullmq');
  const notificationsQueue = new Queue('notifications', { connection: redis });

  for (const rule of alertRules) {
    if (matchesRule(item, rule)) {
      await notificationsQueue.add('send-notification', {
        userId: rule.userId,
        itemId: item.id,
        alertRuleId: rule.id,
      });
    }
  }
}

function matchesRule(item: any, rule: any): boolean {
  const keywords = rule.keywordsJson as string[] || [];
  const examNames = rule.examNamesJson as string[] || [];
  const types = rule.typesJson as ItemType[] || [];
  const locations = rule.locationsJson as string[] || [];

  const text = `${item.title} ${item.body} ${item.shortSummary}`.toLowerCase();
  const entities = item.extractedEntities || {};

  // Check keywords
  if (keywords.length > 0) {
    const hasKeyword = keywords.some(kw => text.includes(kw.toLowerCase()));
    if (!hasKeyword) return false;
  }

  // Check exam names
  if (examNames.length > 0) {
    const examName = entities.examName?.toLowerCase() || '';
    const hasExamName = examNames.some(en => 
      text.includes(en.toLowerCase()) || examName.includes(en.toLowerCase())
    );
    if (!hasExamName) return false;
  }

  // Check types
  if (types.length > 0 && !types.includes(item.type)) {
    return false;
  }

  // Check locations (simple text matching)
  if (locations.length > 0) {
    const hasLocation = locations.some(loc => text.includes(loc.toLowerCase()));
    if (!hasLocation) return false;
  }

  return true;
}

function computeDedupeHash(item: any): string {
  const crypto = require('crypto');
  const normalized = {
    title: item.title.toLowerCase().trim(),
    body: item.body.toLowerCase().trim().substring(0, 500),
    url: item.url,
  };
  
  const hashInput = `${normalized.title}|${normalized.body}|${normalized.url}`;
  return crypto.createHash('sha256').update(hashInput).digest('hex');
}

