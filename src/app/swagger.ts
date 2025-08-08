import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const setupSwagger = (app: INestApplication, apiPrefix = 'api') => {
  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('EZ Auto API')
    .setDescription('Documentation for Backend EZ Auto')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
};
