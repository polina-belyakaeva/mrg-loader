import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MRG } from '../entities/mrg.entity';

@Injectable()
export class MRGService {
  constructor(
    @Inject('MRGRepository')
    private mrgRepository: Repository<MRG>,
  ) { }

  async findAll(): Promise<MRG[]> {
    return this.mrgRepository.find();
  }

  async findByMg(mg: string): Promise<MRG[]> {
    return this.mrgRepository.find({ where: { mg } });
  }

  async createMany(data: Partial<MRG>[]): Promise<MRG[]> {
    const created = this.mrgRepository.create(data);
    return this.mrgRepository.save(created);
  }
} 