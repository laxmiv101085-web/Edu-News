import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user/devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
  constructor(private devicesService: DevicesService) {}

  @Post('register')
  async register(@Request() req, @Body() registerDto: RegisterDeviceDto) {
    return this.devicesService.register(req.user.userId, registerDto);
  }

  @Get()
  async getUserDevices(@Request() req) {
    return this.devicesService.getUserDevices(req.user.userId);
  }

  @Delete(':id')
  async removeDevice(@Request() req, @Param('id') id: string) {
    return this.devicesService.removeDevice(req.user.userId, id);
  }
}

