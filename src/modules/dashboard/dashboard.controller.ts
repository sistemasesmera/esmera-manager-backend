import { Body, Controller, Get, Put } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { UpdateCommonGoalDto } from './dto/update-common.goal.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  findAll() {
    return this.dashboardService.findAll();
  }
  @Get('/nicolas')
  getDataDashboard() {
    return this.dashboardService.getDataDashboard();
  }
  @Put('/commonGoal')
  putCommonGoal(@Body() commonGoal: UpdateCommonGoalDto) {
    return this.dashboardService.updateCommonGoal(commonGoal);
  }
}
