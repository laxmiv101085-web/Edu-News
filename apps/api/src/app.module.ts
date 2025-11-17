import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FeedModule } from './feed/feed.module';
import { AlertRulesModule } from './alert-rules/alert-rules.module';
import { SourcesModule } from './sources/sources.module';
import { DevicesModule } from './devices/devices.module';
import { QueueModule } from './queue/queue.module';
import { LlmModule } from './llm/llm.module';
import { NotificationsModule } from './notifications/notifications.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    FeedModule,
    AlertRulesModule,
    SourcesModule,
    DevicesModule,
    QueueModule,
    LlmModule,
    NotificationsModule,
    IngestionModule,
    HealthModule,
  ],
})
export class AppModule {}

