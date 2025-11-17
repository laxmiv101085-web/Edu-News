import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @Inject('INGESTION_QUEUE') private ingestionQueue: Queue,
    @Inject('PROCESSING_QUEUE') private processingQueue: Queue,
    @Inject('NOTIFICATIONS_QUEUE') private notificationsQueue: Queue,
  ) {}

  async addIngestionJob(data: { sourceId: string }) {
    return this.ingestionQueue.add('ingest-source', data);
  }

  async addProcessingJob(data: { rawItemId: string; sourceId: string }) {
    return this.processingQueue.add('process-item', data);
  }

  async addNotificationJob(data: { userId: string; itemId: string; alertRuleId?: string }) {
    return this.notificationsQueue.add('send-notification', data);
  }
}

