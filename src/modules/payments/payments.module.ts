import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { EmailModule } from '../email/email.module';
import { OnlineSaleCourseModule } from '../online-sale-course/online-sale-course.module';

@Module({
  imports: [EmailModule, OnlineSaleCourseModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
