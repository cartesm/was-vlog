import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { frontUrl, PortApp } from './configs';
import { ValidationPipe } from '@nestjs/common';
import * as cookies from 'cookie-parser';
import helmet from 'helmet';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookies());
  app.use(helmet());
  app.enableCors({
    credentials: true,
    origin: frontUrl,
  });
  app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );
  await app.listen(PortApp);
}
bootstrap();
