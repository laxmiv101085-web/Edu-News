import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ItemType } from '@prisma/client';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getFeed(page = 1, limit = 20, filters?: {
    type?: ItemType;
    search?: string;
    sourceId?: string;
  }) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (filters?.type) {
      where.type = filters.type;
    }
    
    if (filters?.sourceId) {
      where.sourceId = filters.sourceId;
    }
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { body: { contains: filters.search, mode: 'insensitive' } },
        { shortSummary: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          source: {
            select: {
              id: true,
              name: true,
              trustLevel: true,
            },
          },
        },
      }),
      this.prisma.item.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getItemById(id: string) {
    return this.prisma.item.findUnique({
      where: { id },
      include: {
        source: {
          select: {
            id: true,
            name: true,
            trustLevel: true,
            url: true,
          },
        },
      },
    });
  }
}

