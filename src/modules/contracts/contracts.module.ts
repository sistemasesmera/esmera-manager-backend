import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Contract } from './entities/contract.entity';
import { Alumn } from '../alumn/entities/alumn.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, User, Alumn, Course])],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
