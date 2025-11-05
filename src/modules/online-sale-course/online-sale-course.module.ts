import { Module } from '@nestjs/common';
import { OnlineSaleCourseService } from './online-sale-course.service';
import { OnlineSaleCourseController } from './online-sale-course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnlineSaleCourse } from './entities/online-sale-course.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OnlineSaleCourse, User])],
  controllers: [OnlineSaleCourseController],
  providers: [OnlineSaleCourseService],
  exports: [OnlineSaleCourseService],
})
export class OnlineSaleCourseModule {}
