import { Module } from '@nestjs/common';
import { MrgModule } from './mrg/mrg.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'db',
      port: 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'mrg',
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 10,
      retryDelay: 2000,
    }),
    MrgModule,
  ],
})
export class AppModule { }
