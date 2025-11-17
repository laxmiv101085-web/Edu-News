import { ExtractionResult } from '../llm.service';

export interface LlmAdapter {
  extractEntities(text: string): Promise<ExtractionResult>;
}

