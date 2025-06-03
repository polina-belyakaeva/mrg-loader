import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MRG {
  @ApiProperty({ description: 'Уникальный идентификатор записи' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ description: 'Название трубопровода' })
  @Column()
  pipeline!: string;

  @ApiProperty({ description: 'Номер МГ' })
  @Column()
  mg!: string;

  @ApiProperty({ description: 'Километр', type: 'number', format: 'float' })
  @Column('float')
  km!: number;

  @ApiProperty({ description: 'Дата измерения' })
  @Column()
  date!: string;

  @ApiProperty({ description: 'Уровень загрузки в процентах', type: 'number', format: 'float' })
  @Column('float')
  loadLevel!: number;

  @ApiProperty({ description: 'Средний расход', type: 'number', format: 'float' })
  @Column('float')
  avgFlow!: number;

  @ApiProperty({ description: 'ТВПС', type: 'number', format: 'float' })
  @Column('float')
  tvps!: number;
} 