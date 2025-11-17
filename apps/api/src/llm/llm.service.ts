import { Injectable, Inject } from '@nestjs/common';
import { LlmAdapter } from './adapters/llm-adapter.interface';

export interface ExtractionResult {
  examName?: string;
  institution?: string;
  startDate?: string;
  lastDate?: string;
  deadlines?: string[];
  shortSummary: string;
  longSummary: string;
  tags: string[];
}

@Injectable()
export class LlmService {
  constructor(@Inject('LLM_ADAPTER') private adapter: LlmAdapter) {}

  async extractEntities(text: string): Promise<ExtractionResult> {
    return this.adapter.extractEntities(text);
  }
}

