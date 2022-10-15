import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Telegram Tool API')
    .setDescription('API demo for the new telegram tool')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('api/v1/swagger', app, document);

  await app.listen(5000);
}

bootstrap();
