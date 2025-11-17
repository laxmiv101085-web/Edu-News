import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { SourceType } from '@prisma/client';

@Injectable()
export class SourcesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateSourceDto) {
    return this.prisma.source.create({
      data: {
        name: createDto.name,
        url: createDto.url,
        sourceType: createDto.sourceType as SourceType,
        trustLevel: createDto.trustLevel || 5,
        pollIntervalMinutes: createDto.pollIntervalMinutes || 60,
        active: createDto.active !== undefined ? createDto.active : true,
      },
    });
  }

  async findAll() {
    return this.prisma.source.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const source = await this.prisma.source.findUnique({
      where: { id },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    return source;
  }

  async update(id: string, updateDto: Partial<CreateSourceDto>) {
    await this.findOne(id);
    
    const updateData: any = {};
    if (updateDto.name) updateData.name = updateDto.name;
    if (updateDto.url) updateData.url = updateDto.url;
    if (updateDto.sourceType) updateData.sourceType = updateDto.sourceType;
    if (updateDto.trustLevel !== undefined) updateData.trustLevel = updateDto.trustLevel;
    if (updateDto.pollIntervalMinutes !== undefined) updateData.pollIntervalMinutes = updateDto.pollIntervalMinutes;
    if (updateDto.active !== undefined) updateData.active = updateDto.active;

    return this.prisma.source.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.source.delete({
      where: { id },
    });
  }

  async updateLastFetch(id: string) {
    return this.prisma.source.update({
      where: { id },
      data: { lastFetch: new Date() },
    });
  }
}

