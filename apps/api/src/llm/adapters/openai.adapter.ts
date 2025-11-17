import OpenAI from 'openai';
import { LlmAdapter } from './llm-adapter.interface';
import { ExtractionResult } from '../llm.service';

export class OpenAiAdapter implements LlmAdapter {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async extractEntities(text: string): Promise<ExtractionResult> {
    const prompt = `Given this notice text: "${text}", extract exam_name, institution, start_date, last_date (YYYY-MM-DD or null), important_deadline, and a 1-line short summary (<=40 words) and a 2-3 sentence long summary (<=150 words). Return JSON with keys: exam_name, institution, start_date, last_date, deadlines (array), short_summary, long_summary, tags (array of relevant tags). If date is ambiguous, return best_guess and reason.`;

    try {
      const response = await this.client.chat.completions.create({
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
        temperature: 0.0, // Deterministic extraction
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content);
      
      return {
        examName: parsed.exam_name || undefined,
        institution: parsed.institution || undefined,
        startDate: parsed.start_date || undefined,
        lastDate: parsed.last_date || undefined,
        deadlines: parsed.deadlines || [],
        shortSummary: parsed.short_summary || '',
        longSummary: parsed.long_summary || '',
        tags: parsed.tags || [],
      };
    } catch (error) {
      console.error('OpenAI extraction error:', error);
      // Fallback to basic extraction
      return this.fallbackExtraction(text);
    }
  }

  private fallbackExtraction(text: string): ExtractionResult {
    // Basic fallback if OpenAI fails
    const words = text.split(/\s+/).slice(0, 40).join(' ');
    return {
      shortSummary: words + '...',
      longSummary: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
      tags: [],
    };
  }
}

