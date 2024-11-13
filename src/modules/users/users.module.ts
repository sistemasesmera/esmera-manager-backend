import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Contract } from '../contracts/entities/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Contract])],
  providers: [UsersService],
  exports: [UsersService], // Asegúrate de exportar el servicio
  controllers: [UsersController],
})
export class UsersModule {}
