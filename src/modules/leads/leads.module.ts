import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { EmailModule } from '../email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { Branch } from '../branch/entities/branch.entity';
import { User } from '../users/entities/user.entity';
import { Alumn } from '../alumn/entities/alumn.entity';
import { AlumnModule } from '../alumn/alumn.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Branch, User, Alumn]),
    EmailModule,
    AlumnModule,
    AuditLogModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
