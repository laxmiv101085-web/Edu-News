import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async register(userId: string, registerDto: RegisterDeviceDto) {
    // Use upsert to handle duplicate tokens
    return this.prisma.userDevice.upsert({
      where: {
        userId_fcmToken: {
          userId,
          fcmToken: registerDto.fcmToken,
        },
      },
      update: {
        platform: registerDto.platform,
      },
      create: {
        userId,
        fcmToken: registerDto.fcmToken,
        platform: registerDto.platform,
      },
    });
  }

  async getUserDevices(userId: string) {
    return this.prisma.userDevice.findMany({
      where: { userId },
    });
  }

  async removeDevice(userId: string, deviceId: string) {
    return this.prisma.userDevice.deleteMany({
      where: {
        id: deviceId,
        userId,
      },
    });
  }
}

