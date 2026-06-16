import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { Lead } from '../leads/entities/lead.entity';
import { Alumn } from '../alumn/entities/alumn.entity';
import { Contract } from '../contracts/entities/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Alumn, Contract])],
  controllers: [SearchController],
})
export class SearchModule {}
