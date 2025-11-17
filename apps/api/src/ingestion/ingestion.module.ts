import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { SourcesModule } from '../sources/sources.module';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [SourcesModule, QueueModule],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}

