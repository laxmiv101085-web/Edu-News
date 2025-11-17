import { LlmAdapter } from './llm-adapter.interface';
import { ExtractionResult } from '../llm.service';

export class MockAdapter implements LlmAdapter {
  async extractEntities(text: string): Promise<ExtractionResult> {
    // Mock implementation for local testing
    const words = text.split(/\s+/);
    const shortSummary = words.slice(0, 40).join(' ') + (words.length > 40 ? '...' : '');
    const longSummary = words.slice(0, 150).join(' ') + (words.length > 150 ? '...' : '');

    // Simple keyword extraction for tags
    const commonTags = ['exam', 'scholarship', 'result', 'admission', 'notification'];
    const tags = commonTags.filter(tag => 
      text.toLowerCase().includes(tag)
    );

    // Try to extract exam names (common patterns)
    const examPatterns = /(JEE|NEET|UPSC|SSC|GATE|CAT|MAT|XAT|CLAT|AILET|NTA|CBSE|ICSE|State Board)/gi;
    const examMatches = text.match(examPatterns);
    const examName = examMatches ? examMatches[0] : undefined;

    // Try to extract dates
    const datePattern = /\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/g;
    const dates = text.match(datePattern) || [];
    const lastDate = dates.length > 0 ? dates[dates.length - 1] : undefined;

    return {
      examName,
      institution: undefined,
      startDate: undefined,
      lastDate,
      deadlines: dates,
      shortSummary,
      longSummary,
      tags: tags.length > 0 ? tags : ['educational', 'notice'],
    };
  }
}

