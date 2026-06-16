import { Module } from '@nestjs/common';
import { AlumnService } from './alumn.service';
import { AlumnController } from './alumn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumn } from './entities/alumn.entity';
import { EmailModule } from '../email/email.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alumn]), EmailModule, AuditLogModule],
  controllers: [AlumnController],
  providers: [AlumnService],
  exports: [AlumnService],
})
export class AlumnModule {}
