import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class PageAndUserPipe implements PipeTransform {
  constructor(private i18n: I18nService) {}
  throwNotAceptable(error: string) {
    throw new NotAcceptableException(
      this.i18n.t(error, {
        lang: I18nContext.current().lang,
      }),
    );
  }

  transform(value: { page: number; user: string }, metadata: ArgumentMetadata) {
    const { page, user } = value;

    const parsePage: number | typeof NaN = Number(page);
    if (isNaN(parsePage)) this.throwNotAceptable('test.pageNotAceptable');
    if (parsePage <= 0) this.throwNotAceptable('test.pageInvalidValue');
    if (!isValidObjectId(user)) this.throwNotAceptable('test.idNotAcceptable');

    return { page: parsePage, user };
  }
}
