import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from 'src/constants/Roles.enum';
import { Lead } from '../leads/entities/lead.entity';
import { Alumn } from '../alumn/entities/alumn.entity';
import { Contract } from '../contracts/entities/contract.entity';

@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS, UserRoles.COMMERCIAL)
export class SearchController {
  constructor(
    @InjectRepository(Lead) private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Alumn) private readonly alumnRepo: Repository<Alumn>,
    @InjectRepository(Contract) private readonly contractRepo: Repository<Contract>,
  ) {}

  @Get()
  async search(@Query('q') q: string) {
    if (!q || q.trim().length < 2) {
      return { leads: [], alumns: [], contracts: [] };
    }

    const like = `%${q.trim()}%`;

    const [leads, alumns, contracts] = await Promise.all([
      this.leadRepo
        .createQueryBuilder('lead')
        .select(['lead.id', 'lead.name', 'lead.phone', 'lead.email', 'lead.status'])
        .where('lead.name ILIKE :like OR lead.phone ILIKE :like OR lead.email ILIKE :like', { like })
        .orderBy('lead.createdAt', 'DESC')
        .take(5)
        .getMany(),

      this.alumnRepo
        .createQueryBuilder('alumn')
        .select(['alumn.id', 'alumn.firstName', 'alumn.lastName', 'alumn.email', 'alumn.documentNumber'])
        .where(
          'alumn.firstName ILIKE :like OR alumn.lastName ILIKE :like OR alumn.email ILIKE :like OR alumn.documentNumber ILIKE :like OR CONCAT(alumn.firstName, \' \', alumn.lastName) ILIKE :like',
          { like },
        )
        .orderBy('alumn.createdAt', 'DESC')
        .take(5)
        .getMany(),

      this.contractRepo
        .createQueryBuilder('contract')
        .leftJoin('contract.alumn', 'alumn')
        .select(['contract.id', 'contract.name', 'alumn.firstName', 'alumn.lastName', 'alumn.id'])
        .where(
          'contract.name ILIKE :like OR alumn.firstName ILIKE :like OR alumn.lastName ILIKE :like OR CONCAT(alumn.firstName, \' \', alumn.lastName) ILIKE :like',
          { like },
        )
        .orderBy('contract.createdAt', 'DESC')
        .take(5)
        .getMany(),
    ]);

    return { leads, alumns, contracts };
  }
}
