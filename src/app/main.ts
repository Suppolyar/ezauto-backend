import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const API_PREFIX = 'api';
  const PORT = Number(process.env.PORT || 3000);
  const HOST = process.env.HOST || '0.0.0.0'; // важно для Railway

  app.enableCors();
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  setupSwagger(app, API_PREFIX);

  await app.listen(PORT, HOST);

  const publicUrl =
    process.env.PUBLIC_URL || process.env.BASE_URL || `http://${HOST}:${PORT}`;

  Logger.log(`🚀 App is running: ${publicUrl}/${API_PREFIX}`);
  Logger.log(`📚 Swagger docs: ${publicUrl}/${API_PREFIX}/docs`);
}

void bootstrap();
