import { ApiProperty } from '@nestjs/swagger';

export class MRGResponseDto {
  @ApiProperty({ type: 'number' })
  id!: number;

  @ApiProperty({ type: 'string' })
  pipeline!: string;

  @ApiProperty({ type: 'string' })
  mg!: string;

  @ApiProperty({ type: 'number' })
  km!: number;

  @ApiProperty({ type: 'string' })
  date!: string;

  @ApiProperty({ type: 'number' })
  loadLevel!: number;

  @ApiProperty({ type: 'number' })
  avgFlow!: number;

  @ApiProperty({ type: 'number' })
  tvps!: number;
}
