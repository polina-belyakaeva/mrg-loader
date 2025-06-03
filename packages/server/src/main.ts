import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: 'http://localhost:3001' });

  const config = new DocumentBuilder()
    .setTitle('MRG Loader API')
    .setDescription('Импорт и просмотр загрузки МРГ')
    .setVersion('1.0')
    .addTag('mrg')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Swagger UI available at http://localhost:3000/api');
}
bootstrap(); 