import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { Campaign } from './entities/campaign.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupons.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Coupon]), EmailModule],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
