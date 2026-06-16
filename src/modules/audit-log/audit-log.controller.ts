import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoles } from 'src/constants/Roles.enum';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoles.ADMIN, UserRoles.COMMERCIAL_PLUS)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    filter: FilterAuditLogDto,
  ) {
    return this.auditLogService.findAll(filter);
  }
}
