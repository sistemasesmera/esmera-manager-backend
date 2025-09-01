// src/modules/branch/branch.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { Branch } from './entities/branch.entity';

@Controller('branchs')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  findAll(): Promise<Branch[]> {
    return this.branchService.findAll();
  }
}
