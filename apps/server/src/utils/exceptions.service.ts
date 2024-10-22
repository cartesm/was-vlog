import {
  ConflictException,
  ImATeapotException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ExceptionsService {
  constructor(private i18n: I18nService) {}

  throwNotAceptable(value: string): void {
    throw new NotAcceptableException(
      this.i18n.t(value, { lang: I18nContext.current().lang }),
    );
  }
  throwUnauthorized(value: string): void {
    throw new UnauthorizedException(
      this.i18n.t(value, { lang: I18nContext.current().lang }),
    );
  }
  throwITeapot(value: string): void {
    throw new ImATeapotException(
      this.i18n.t(value, { lang: I18nContext.current().lang }),
    );
  }
  throwConflict(value: string): void {
    throw new ConflictException(
      this.i18n.t(value, { lang: I18nContext.current().lang }),
    );
  }
  throwNotFound(value: string): void {
    throw new NotFoundException(
      this.i18n.t(value, { lang: I18nContext.current().lang }),
    );
  }
}
