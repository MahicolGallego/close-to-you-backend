import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //enable serialization of response objects (apply class-transformer)
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  //Config Swagger to API Documentation
  const config = new DocumentBuilder()
    .setTitle('Close To You API')
    .setDescription(
      `This API provides functionality for managing contacts. It allows users to:
      Create Contacts: Users can add new contacts with relevant information (e.g., name, phone, email, location).
      Update Contacts: Users can modify their existing contacts.
      Get Contacts: Retrieve a list of contacts or individual contact details, ensuring users can only access their own contacts.
      Delete Contacts: Users can remove contacts they no longer need.
      The API ensures that users can only interact with their own contacts, enforcing access control by verifying the associated id_user for each request.`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('close-to-you/api/v1/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
