import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PortApp } from './configs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(PortApp);
}
bootstrap();
