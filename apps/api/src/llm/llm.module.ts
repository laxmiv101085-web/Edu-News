import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LlmService } from './llm.service';
import { OpenAiAdapter } from './adapters/openai.adapter';
import { MockAdapter } from './adapters/mock.adapter';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    LlmService,
    {
      provide: 'LLM_ADAPTER',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const apiKey = config.get('OPENAI_API_KEY');
        if (apiKey) {
          return new OpenAiAdapter(apiKey);
        }
        return new MockAdapter();
      },
    },
  ],
  exports: [LlmService],
})
export class LlmModule {}

