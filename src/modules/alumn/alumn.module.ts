import { Module } from '@nestjs/common';
import { AlumnService } from './alumn.service';
import { AlumnController } from './alumn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumn } from './entities/alumn.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alumn])],
  controllers: [AlumnController],
  providers: [AlumnService],
})
export class AlumnModule {}
