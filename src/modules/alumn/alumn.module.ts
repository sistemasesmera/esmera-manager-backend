import { Module } from '@nestjs/common';
import { AlumnService } from './alumn.service';
import { AlumnController } from './alumn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumn } from './entities/alumn.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Alumn]), EmailModule],
  controllers: [AlumnController],
  providers: [AlumnService],
})
export class AlumnModule {}
