import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL') || 'redis://localhost:6379';
        return new Redis(redisUrl);
      },
    },
    {
      provide: 'INGESTION_QUEUE',
      inject: ['REDIS_CLIENT'],
      useFactory: (redis: Redis) => {
        return new Queue('ingestion', { connection: redis });
      },
    },
    {
      provide: 'PROCESSING_QUEUE',
      inject: ['REDIS_CLIENT'],
      useFactory: (redis: Redis) => {
        return new Queue('processing', { connection: redis });
      },
    },
    {
      provide: 'NOTIFICATIONS_QUEUE',
      inject: ['REDIS_CLIENT'],
      useFactory: (redis: Redis) => {
        return new Queue('notifications', { connection: redis });
      },
    },
    QueueService,
  ],
  exports: [QueueService],
})
export class QueueModule {}

