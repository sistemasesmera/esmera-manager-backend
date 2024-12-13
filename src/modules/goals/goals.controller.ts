import { Controller, Post, Body } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  // Endpoint para crear una meta
  @Post()
  async create(@Body() createGoalDto: CreateGoalDto) {
    return await this.goalsService.createGoal(createGoalDto);
  }
}
