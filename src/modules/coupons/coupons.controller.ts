import { Body, Controller, Get, Post } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { GenerateCouponDto } from './dto/generate-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get('/campaigns')
  async getCampaigns() {
    const campaigns = await this.couponsService.getCampaigns();
    return campaigns;
  }

  @Post('/generate')
  async generateCoupon(@Body() generateCouponDto: GenerateCouponDto) {
    const coupon = await this.couponsService.generateCoupon(generateCouponDto);
    return coupon;
  }

  @Post('/campaign')
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    const campaign =
      await this.couponsService.createCampaign(createCampaignDto);
    return campaign;
  }
}
