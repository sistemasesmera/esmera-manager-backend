import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Contract } from './entities/contract.entity';
import { Alumn } from '../alumn/entities/alumn.entity';
import { Course } from '../courses/entities/course.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, User, Alumn, Course]), AuditLogModule],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService], // Asegúrate de exportar el servicio
})
export class ContractsModule {}
