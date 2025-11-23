import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';
import { SourcesService } from '../sources/sources.service';
import Parser = require('rss-parser');
import axios from 'axios';
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';
import * as crypto from 'crypto';
import { SourceType, ItemType } from '@prisma/client';

interface RawItemData {
  title: string;
  body: string;
  url: string;
  publishedAt: Date;
  sourceId: string;
}

@Injectable()
export class IngestionService {
  private rssParser: Parser;

  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
    private sourcesService: SourcesService,
  ) {
    this.rssParser = new Parser();
  }

  async ingestSource(sourceId: string) {
    const source = await this.prisma.source.findUnique({
      where: { id: sourceId },
    });

    if (!source || !source.active) {
      throw new Error('Source not found or inactive');
    }

    try {
      let items: RawItemData[] = [];

      switch (source.sourceType) {
        case 'RSS':
          items = await this.ingestRSS(source.url, sourceId);
          break;
        case 'API':
          items = await this.ingestAPI(source.url, sourceId);
          break;
        case 'HTML':
          items = await this.ingestHTML(source.url, sourceId);
          break;
      }

      // Store raw items and queue for processing
      for (const item of items) {
        const dedupeHash = this.computeDedupeHash(item);

        // Check for duplicates (within last 30 days)
        const existing = await this.prisma.item.findFirst({
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
        const rawItem = await this.prisma.rawItem.create({
          data: {
            sourceId,
            rawJson: item as any,
          },
        });

        // Queue for processing
        await this.queueService.addProcessingJob({
          rawItemId: rawItem.id,
          sourceId,
        });
      }

      // Update last fetch time
      await this.sourcesService.updateLastFetch(sourceId);

      return { ingested: items.length };
    } catch (error) {
      console.error(`Error ingesting source ${sourceId}:`, error);
      throw error;
    }
  }

  private async ingestRSS(url: string, sourceId: string): Promise<RawItemData[]> {
    try {
      const feed = await this.rssParser.parseURL(url);
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

  private async ingestAPI(url: string, sourceId: string): Promise<RawItemData[]> {
    try {
      const response = await axios.get(url);
      const data = response.data;

      // Assume API returns array of items or { items: [...] }
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

  private async ingestHTML(url: string, sourceId: string): Promise<RawItemData[]> {
    try {
      // Check robots.txt
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
        // robots.txt not found or error - proceed with caution
        console.warn('Could not fetch robots.txt, proceeding...');
      }

      // Add random delay to be polite and avoid rate limits (1-3 seconds)
      const delay = Math.floor(Math.random() * 2000) + 1000;
      await new Promise(resolve => setTimeout(resolve, delay));

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        timeout: 10000, // 10s timeout
      });

      const $ = cheerio.load(response.data);

      // Try to find article/notice elements
      const articles: RawItemData[] = [];

      // Common selectors for educational notices
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

      // If no structured content found, treat entire page as one item
      if (articles.length === 0) {
        const title = $('title').text() || $('h1').first().text() || 'Untitled';
        const body = $('body').text().replace(/\s+/g, ' ').trim();

        if (body) {
          articles.push({
            title,
            body: body.substring(0, 5000), // Limit body size
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

  private computeDedupeHash(item: RawItemData): string {
    const normalized = {
      title: item.title.toLowerCase().trim(),
      body: item.body.toLowerCase().trim().substring(0, 500),
      url: item.url,
    };

    const hashInput = `${normalized.title}|${normalized.body}|${normalized.url}`;
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }
}

