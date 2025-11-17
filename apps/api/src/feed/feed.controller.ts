import { Controller, Get, Query, Param, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { FeedService } from './feed.service';
import { ItemType } from '@prisma/client';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  async getFeed(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('type') type?: ItemType,
    @Query('search') search?: string,
    @Query('sourceId') sourceId?: string,
  ) {
    return this.feedService.getFeed(page, limit, { type, search, sourceId });
  }

  @Get('items/:id')
  async getItem(@Param('id') id: string) {
    return this.feedService.getItemById(id);
  }
}

