import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SourcesService } from './sources.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('sources')
@UseGuards(JwtAuthGuard, AdminGuard)
export class SourcesController {
  constructor(private sourcesService: SourcesService) {}

  @Post()
  async create(@Body() createDto: CreateSourceDto) {
    return this.sourcesService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.sourcesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sourcesService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: Partial<CreateSourceDto>) {
    return this.sourcesService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sourcesService.remove(id);
  }
}

