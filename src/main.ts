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

  const config = new DocumentBuilder()
    .setTitle('Qr-Backend')
    .addBearerAuth(
      {
        type: 'http',
      },
      'jwt-auth'
    )
    .addServer(process.env.NODE_ENV === 'production' ? '/qr' : '/')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
