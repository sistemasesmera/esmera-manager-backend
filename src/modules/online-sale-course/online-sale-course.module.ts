import { Module } from '@nestjs/common';
import { OnlineSaleCourseService } from './online-sale-course.service';
import { OnlineSaleCourseController } from './online-sale-course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineSaleCourse } from './entities/online-sale-course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OnlineSaleCourse])],
  controllers: [OnlineSaleCourseController],
  providers: [OnlineSaleCourseService],
})
export class OnlineSaleCourseModule {}
