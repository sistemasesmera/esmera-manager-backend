import { Controller, Body, Post, Get, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  //Para cursos presenciales - (lleva a tablero principal)
  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.create(createLeadDto);
  }

  //Para cursos online - (lleva a tablero de cursos online)
  @Post('online')
  async createLead(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.createOnline(createLeadDto);
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
