import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Put } from '@nestjs/common';
import { AlertRulesService } from './alert-rules.service';
import { CreateAlertRuleDto } from './dto/create-alert-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('alert-rules')
@UseGuards(JwtAuthGuard)
export class AlertRulesController {
  constructor(private alertRulesService: AlertRulesService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateAlertRuleDto) {
    return this.alertRulesService.create(req.user.userId, createDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.alertRulesService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.alertRulesService.findOne(id, req.user.userId);
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: Partial<CreateAlertRuleDto>) {
    return this.alertRulesService.update(id, req.user.userId, updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.alertRulesService.remove(id, req.user.userId);
  }
}

