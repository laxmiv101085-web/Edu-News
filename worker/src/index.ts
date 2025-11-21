import 'dotenv/config';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import { IngestionProcessor } from './processors/ingestion.processor';
import { ProcessingProcessor } from './processors/processing.processor';
import { NotificationProcessor } from './processors/notification.processor';
import { CronScheduler } from './scheduler/cron.scheduler';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const prisma = new PrismaClient();

console.log('🚀 Starting worker...');

// Create workers for each queue
// Lower concurrency for free tier (512MB RAM limit)
const ingestionWorker = new Worker('ingestion', IngestionProcessor(prisma, redis), {
  connection: redis,
  concurrency: 2, // Reduced from 5
});

const processingWorker = new Worker('processing', ProcessingProcessor(prisma, redis), {
  connection: redis,
  concurrency: 2, // Reduced from 10
});

const notificationsWorker = new Worker('notifications', NotificationProcessor(prisma, redis), {
  connection: redis,
  concurrency: 5, // Reduced from 20
});

// Start cron scheduler for periodic ingestion
const scheduler = new CronScheduler(prisma, redis);
scheduler.start();

// Error handlers
ingestionWorker.on('completed', (job) => {
  console.log(`✅ Ingestion job ${job.id} completed`);
});

ingestionWorker.on('failed', (job, err) => {
  console.error(`❌ Ingestion job ${job?.id} failed:`, err);
});

processingWorker.on('completed', (job) => {
  console.log(`✅ Processing job ${job.id} completed`);
});

processingWorker.on('failed', (job, err) => {
  console.error(`❌ Processing job ${job?.id} failed:`, err);
});

notificationsWorker.on('completed', (job) => {
  console.log(`✅ Notification job ${job.id} completed`);
});

notificationsWorker.on('failed', (job, err) => {
  console.error(`❌ Notification job ${job?.id} failed:`, err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down workers...');
  await ingestionWorker.close();
  await processingWorker.close();
  await notificationsWorker.close();
  await scheduler.stop();
  await prisma.$disconnect();
  await redis.quit();
  process.exit(0);
});

// Add a simple HTTP server for Render health checks
import * as http from 'http';
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Worker is running');
});

server.listen(PORT, () => {
  console.log(`✅ Worker HTTP server listening on port ${PORT}`);
});

console.log('✅ Workers started successfully');

