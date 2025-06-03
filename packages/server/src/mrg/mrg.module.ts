import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MRG } from '../entities/mrg.entity';
import { MRGService } from './mrg.service';
import { MRGController } from './mrg.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MRG])],
  controllers: [MRGController],
  providers: [MRGService],
})
export class MrgModule { }