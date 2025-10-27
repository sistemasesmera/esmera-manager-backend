import { Controller } from '@nestjs/common';
import { OnlineSaleCourseService } from './online-sale-course.service';

@Controller('online-sale-course')
export class OnlineSaleCourseController {
  constructor(
    private readonly onlineSaleCourseService: OnlineSaleCourseService,
  ) {}
}
