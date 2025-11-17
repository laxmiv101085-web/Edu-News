import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';
import * as crypto from 'crypto';

const rssParser = new Parser();

export function IngestionProcessor(prisma: PrismaClient, redis: Redis) {
  return async (job: Job) => {
    const { sourceId } = job.data;
    
    console.log(`Processing ingestion for source ${sourceId}`);
    
    const source = await prisma.source.findUnique({
      where: { id: sourceId },
    });

    if (!source || !source.active) {
      throw new Error('Source not found or inactive');
    }

    let items: any[] = [];

    try {
      switch (source.sourceType) {
        case 'RSS':
          items = await ingestRSS(source.url, sourceId);
          break;
        case 'API':
          items = await ingestAPI(source.url, sourceId);
          break;
        case 'HTML':
          items = await ingestHTML(source.url, sourceId);
          break;
      }

      // Store raw items and queue for processing
      const queue = (await import('bullmq')).Queue;
      const processingQueue = new queue('processing', { connection: redis });
      
      let ingestedCount = 0;
      
      for (const item of items) {
        const dedupeHash = computeDedupeHash(item);
        
        // Check for duplicates (within last 30 days)
        const existing = await prisma.item.findFirst({
          where: {
            dedupeHash,
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        });

        if (existing) {
          continue; // Skip duplicate
        }

        // Store raw item
        const rawItem = await prisma.rawItem.create({
          data: {
            sourceId,
            rawJson: item as any,
          },
        });

        // Queue for processing
        await processingQueue.add('process-item', {
          rawItemId: rawItem.id,
          sourceId,
        });
        
        ingestedCount++;
      }

      // Update last fetch time
      await prisma.source.update({
        where: { id: sourceId },
        data: { lastFetch: new Date() },
      });

      return { ingested: ingestedCount };
    } catch (error) {
      console.error(`Error ingesting source ${sourceId}:`, error);
      throw error;
    }
  };
}

async function ingestRSS(url: string, sourceId: string): Promise<any[]> {
  try {
    const feed = await rssParser.parseURL(url);
    return (feed.items || []).map(item => ({
      title: item.title || 'Untitled',
      body: item.contentSnippet || item.content || item.description || '',
      url: item.link || url,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      sourceId,
    }));
  } catch (error) {
    console.error('RSS ingestion error:', error);
    return [];
  }
}

async function ingestAPI(url: string, sourceId: string): Promise<any[]> {
  try {
    const response = await axios.get(url);
    const data = response.data;
    const items = Array.isArray(data) ? data : (data.items || []);
    
    return items.map((item: any) => ({
      title: item.title || item.headline || 'Untitled',
      body: item.body || item.description || item.content || '',
      url: item.url || item.link || url,
      publishedAt: item.publishedAt || item.published_at || item.date ? new Date(item.publishedAt || item.published_at || item.date) : new Date(),
      sourceId,
    }));
  } catch (error) {
    console.error('API ingestion error:', error);
    return [];
  }
}

async function ingestHTML(url: string, sourceId: string): Promise<any[]> {
  try {
    const robotsUrl = new URL('/robots.txt', url).toString();
    let robots: any = null;
    
    try {
      const robotsResponse = await axios.get(robotsUrl);
      robots = robotsParser(robotsUrl, robotsResponse.data);
      
      if (robots && !robots.isAllowed(url, 'EducationalNewsBot')) {
        console.warn(`URL ${url} is disallowed by robots.txt`);
        return [];
      }
    } catch (error) {
      console.warn('Could not fetch robots.txt, proceeding...');
    }

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'EducationalNewsBot/1.0' },
    });

    const $ = cheerio.load(response.data);
    const articles: any[] = [];
    
    $('article, .notice, .notification, .announcement, .post').each((_, el) => {
      const title = $(el).find('h1, h2, h3, .title, .heading').first().text().trim();
      const body = $(el).find('.content, .body, .description, p').text().trim();
      const link = $(el).find('a').first().attr('href') || url;
      const dateText = $(el).find('.date, .published, time').first().attr('datetime') || 
                      $(el).find('.date, .published, time').first().text();
      
      if (title && body) {
        articles.push({
          title,
          body,
          url: new URL(link, url).toString(),
          publishedAt: dateText ? new Date(dateText) : new Date(),
          sourceId,
        });
      }
    });

    if (articles.length === 0) {
      const title = $('title').text() || $('h1').first().text() || 'Untitled';
      const body = $('body').text().replace(/\s+/g, ' ').trim();
      
      if (body) {
        articles.push({
          title,
          body: body.substring(0, 5000),
          url,
          publishedAt: new Date(),
          sourceId,
        });
      }
    }

    return articles;
  } catch (error) {
    console.error('HTML ingestion error:', error);
    return [];
  }
}

function computeDedupeHash(item: any): string {
  const normalized = {
    title: item.title.toLowerCase().trim(),
    body: item.body.toLowerCase().trim().substring(0, 500),
    url: item.url,
  };
  
  const hashInput = `${normalized.title}|${normalized.body}|${normalized.url}`;
  return crypto.createHash('sha256').update(hashInput).digest('hex');
}

