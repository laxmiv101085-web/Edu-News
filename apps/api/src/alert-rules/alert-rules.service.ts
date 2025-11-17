import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';
import { ItemType } from '@prisma/client';

@Injectable()
export class AlertRulesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateAlertRuleDto) {
    return this.prisma.alertRule.create({
      data: {
        userId,
        name: createDto.name,
        keywordsJson: createDto.keywords || [],
        examNamesJson: createDto.examNames || [],
        typesJson: createDto.types || [],
        locationsJson: createDto.locations || [],
        minTrustLevel: createDto.minTrustLevel || 5,
        frequency: createDto.frequency || 'immediate',
        active: createDto.active !== undefined ? createDto.active : true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.alertRule.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const rule = await this.prisma.alertRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException('Alert rule not found');
    }

    if (rule.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return rule;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.alertRule.delete({
      where: { id },
    });
  }

  async update(id: string, userId: string, updateDto: Partial<CreateAlertRuleDto>) {
    await this.findOne(id, userId);
    
    const updateData: any = {};
    if (updateDto.name) updateData.name = updateDto.name;
    if (updateDto.keywords) updateData.keywordsJson = updateDto.keywords;
    if (updateDto.examNames) updateData.examNamesJson = updateDto.examNames;
    if (updateDto.types) updateData.typesJson = updateDto.types;
    if (updateDto.locations) updateData.locationsJson = updateDto.locations;
    if (updateDto.minTrustLevel !== undefined) updateData.minTrustLevel = updateDto.minTrustLevel;
    if (updateDto.frequency) updateData.frequency = updateDto.frequency;
    if (updateDto.active !== undefined) updateData.active = updateDto.active;

    return this.prisma.alertRule.update({
      where: { id },
      data: updateData,
    });
  }
}

