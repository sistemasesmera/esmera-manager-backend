import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { FilterAuditLogDto } from './dto/filter-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  log(data: Partial<AuditLog>): void {
    this.auditLogRepository
      .save(this.auditLogRepository.create(data))
      .catch((err) => console.error('[AuditLog] Error al guardar log:', err));
  }

  async findAll(filter: FilterAuditLogDto) {
    const {
      entityType,
      action,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 25,
    } = filter;

    const effectiveLimit = Math.min(limit, 100);

    const qb = this.auditLogRepository
      .createQueryBuilder('log')
      .orderBy('log.createdAt', 'DESC');

    if (entityType) {
      qb.andWhere('log.entityType = :entityType', { entityType });
    }
    if (action) {
      qb.andWhere('log.action = :action', { action });
    }
    if (userId) {
      qb.andWhere('log.userId = :userId', { userId });
    }
    if (startDate) {
      qb.andWhere('log.createdAt >= :startDate', {
        startDate: new Date(startDate + 'T00:00:00Z'),
      });
    }
    if (endDate) {
      qb.andWhere('log.createdAt <= :endDate', {
        endDate: new Date(endDate + 'T23:59:59Z'),
      });
    }

    const [data, total] = await qb
      .skip((page - 1) * effectiveLimit)
      .take(effectiveLimit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / effectiveLimit),
    };
  }
}
