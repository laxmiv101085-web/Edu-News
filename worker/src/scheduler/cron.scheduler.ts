import { CronJob } from 'cron';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { Queue } from 'bullmq';

export class CronScheduler {
  private jobs: CronJob[] = [];
  private prisma: PrismaClient;
  private redis: Redis;

  constructor(prisma: PrismaClient, redis: Redis) {
    this.prisma = prisma;
    this.redis = redis;
  }

  start() {
    // Run every 5 minutes to check for sources that need ingestion
    const job = new CronJob(
      '*/5 * * * *',
      async () => {
        await this.checkAndQueueSources();
      },
      null,
      true,
      'America/New_York'
    );

    this.jobs.push(job);
    
    console.log('📅 Cron scheduler started');
  }

  async stop() {
    for (const job of this.jobs) {
      job.stop();
    }
    this.jobs = [];
  }

  private async checkAndQueueSources() {
    try {
      const sources = await this.prisma.source.findMany({
        where: { active: true },
      });

      const ingestionQueue = new Queue('ingestion', { connection: this.redis });

      for (const source of sources) {
        const now = new Date();
        const lastFetch = source.lastFetch || new Date(0);
        const intervalMs = source.pollIntervalMinutes * 60 * 1000;
        const nextFetch = new Date(lastFetch.getTime() + intervalMs);

        if (now >= nextFetch) {
          console.log(`Queueing ingestion for source ${source.id} (${source.name})`);
          await ingestionQueue.add('ingest-source', { sourceId: source.id });
        }
      }
    } catch (error) {
      console.error('Error in cron scheduler:', error);
    }
  }
}

