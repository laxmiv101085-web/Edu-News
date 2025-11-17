import { IsString, IsArray, IsOptional, IsInt, Min, Max, IsBoolean, IsEnum } from 'class-validator';
import { ItemType } from '@prisma/client';

export class CreateAlertRuleDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  examNames?: string[];

  @IsArray()
  @IsEnum(ItemType, { each: true })
  @IsOptional()
  types?: ItemType[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  locations?: string[];

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  minTrustLevel?: number;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}

