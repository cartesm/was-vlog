import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PortApp } from './configs';
import { ValidationPipe } from '@nestjs/common';
import * as cookies from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookies());
  app.enableCors({
    credentials: true,
    origin: 'http://localhost:3001',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(PortApp);
  // TODO: configurar helmtet
  // TODO: agregar readme.md
  // TODO: crear descripcion en gh
}
bootstrap();
