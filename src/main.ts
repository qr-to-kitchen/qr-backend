import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production') {
    app.setGlobalPrefix('qr');
  }

  const config = new DocumentBuilder()
    .setTitle('Qr-Backend')
    .addBearerAuth(
      {
        type: 'http',
      },
      'jwt-auth'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = process.env.NODE_ENV === 'production' ? 'qr/api' : 'api';
  SwaggerModule.setup(swaggerPath, app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
