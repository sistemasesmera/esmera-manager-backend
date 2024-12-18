import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Coupon } from './entities/coupons.entity';
import { GenerateCouponDto } from './dto/generate-coupon.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
    private readonly emailService: EmailService,
  ) {}
  // Servicio para crear Campaña.
  async createCampaign(
    createCampaignDto: CreateCampaignDto,
  ): Promise<Campaign> {
    const { campaignCode } = createCampaignDto;

    // Verificar si ya existe una campaña con el mismo campaignCode
    const existingCampaign = await this.campaignRepository.findOne({
      where: { campaignCode },
    });

    if (existingCampaign) {
      throw new HttpException(
        'A campaign with this code already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Crear y guardar la nueva campaña
    const campaign = this.campaignRepository.create({
      ...createCampaignDto,
      status: 'active',
      availableCoupons: createCampaignDto.totalCoupons,
    });

    return this.campaignRepository.save(campaign);
  }

  //Funcion para generar el cupon.
  async generateCoupon(generateCouponDto: GenerateCouponDto): Promise<Coupon> {
    const { email, name, phone, campaignCode } = generateCouponDto;

    // Buscar la campaña por su código (para asociarla a el cupon)
    const campaign = await this.campaignRepository.findOne({
      where: { campaignCode },
      select: [
        'id',
        'campaignCode',
        'courseName',
        'discountAmount',
        'availableCoupons',
        'totalCoupons',
        'expirationDate',
      ], // Solo selecciona estos campos
    });

    // Si no se encuentra la campaña, lanzar error
    if (!campaign) {
      throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
    }

    // Verificar si la campaña tiene cupones disponibles
    if (campaign.availableCoupons <= 0) {
      throw new HttpException(
        'No coupons available for this campaign',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Generar código único para el cupón (empezar desde 1 y aumentar)
    const couponNumber = campaign.totalCoupons - campaign.availableCoupons + 1;

    const couponCode = `${campaign.campaignCode}-${couponNumber}`; // Genera el código desde el 1 hacia arriba

    // Buscar un cupon para verificar si existe el email o si existe el couponcode
    const existingCoupon = await this.couponRepository.findOne({
      where: [
        { couponCode }, // Verificar por couponCode
        { email }, // O verificar por email
      ],
    });
    if (existingCoupon) {
      throw new HttpException(
        existingCoupon.email === email
          ? 'Coupon with this email already exists'
          : 'Coupon code already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Crear una nueva instancia de Cupón
    const coupon = this.couponRepository.create({
      couponCode,
      campaign,
      email,
      name,
      phone,
      isUsed: false, // El cupón aún no ha sido utilizado
    });

    // Disminuir los cupones disponibles en la campaña
    campaign.availableCoupons--;

    // Guardar el cupón y la campaña actualizada
    await this.campaignRepository.save(campaign);
    await this.couponRepository.save(coupon);

    await this.emailService.sendCouponEmail({
      name,
      email,
      coupon: coupon.couponCode,
      discount: campaign.discountAmount,
      expirationDate: campaign.expirationDate,
      courseName: campaign.courseName,
    });

    // TODO: QUEDA PENDIENTE QUE SE LE ENVIE AL CORREO!!. Que se le envie el correoa

    delete coupon.campaign.availableCoupons;
    delete coupon.campaign.totalCoupons;

    return coupon;
  }

  async getCampaigns() {
    return await this.campaignRepository.find({
      where: {
        status: 'active',
        availableCoupons: MoreThan(0), // Filtrar solo las campañas activas y con cupones disponibles
      },
    });
  }
}
