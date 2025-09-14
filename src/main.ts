import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { v2 as cloudinary } from 'cloudinary';

async function bootstrap() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const app = await NestFactory.create(AppModule);

  const builder = new DocumentBuilder()
    .setTitle('Qr-Backend')
    .addBearerAuth(
      {
        type: 'http',
      },
      'jwt-auth'
    );

  if (process.env.NODE_ENV === 'production') {
    builder
      .addServer('qr', 'Prod-dominio')
      .addServer('/', 'Dev Prod-ip');
  } else {
    builder
      .addServer('/', 'Dev Prod-ip')
      .addServer('qr', 'Prod-dominio');
  }

  const document = SwaggerModule.createDocument(app, builder.build());
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().then();
