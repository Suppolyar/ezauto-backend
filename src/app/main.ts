import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const API_PREFIX = 'api';
  const PORT = Number(process.env.PORT ?? 3000);

  app.enableCors();
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  setupSwagger(app, API_PREFIX);

  await app.listen(PORT);

  Logger.log(`🚀 App is running: http://localhost:${PORT}/${API_PREFIX}`);
  Logger.log(`📚 Swagger docs: http://localhost:${PORT}/${API_PREFIX}/docs`);
}

void bootstrap();
