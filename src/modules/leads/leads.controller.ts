import { Controller, Body, Post, Get, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.create(createLeadDto);
  }

  @Get('validate-item')
  async validateItem(@Query('itemId') itemId: string) {
    if (!itemId) {
      return {
        exists: false,
        error: 'Falta itemId',
        item: null,
        boardId: null,
        statusColumnId: null,
      };
    }

    const { exists, item, boardId, statusColumnId } =
      await this.leadsService.validateItem(itemId);
    return { exists, item, error: null, boardId, statusColumnId };
  }
}
