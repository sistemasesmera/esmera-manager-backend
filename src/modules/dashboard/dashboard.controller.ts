import { Body, Controller, Get, Post, Put } from '@nestjs/common';
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

  @Post('/webhook')
  test(
    @Body()
    request,
  ) {
    console.log('EXAMPLE');
    console.log(request);
    // Process webhook data here
    // Example:
    // const data = request.body;
    // const { userId, action } = data;
    // if (action === 'contract_created') {
    //   const contract = await this.contractsService.create(data);
    //   // Send notification or perform other actions
    // }
    //...
    return 'Webhook received';
  }
}
