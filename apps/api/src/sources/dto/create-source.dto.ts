import { IsString, IsEnum, IsInt, Min, Max, IsOptional, IsBoolean, IsUrl } from 'class-validator';
import { SourceType } from '@prisma/client';

export class CreateSourceDto {
  @IsString()
  name: string;

  @IsUrl()
  url: string;

  @IsEnum(SourceType)
  sourceType: SourceType;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  trustLevel?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  pollIntervalMinutes?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

