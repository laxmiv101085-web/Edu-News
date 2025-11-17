import { IsString, IsEnum } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  fcmToken: string;

  @IsEnum(['web', 'android', 'ios'])
  platform: 'web' | 'android' | 'ios';
}

