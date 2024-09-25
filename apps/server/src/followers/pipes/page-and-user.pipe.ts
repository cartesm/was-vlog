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

  transform(value: { page: number; user: string }, metadata: ArgumentMetadata) {
    const { page, user } = value;

    const parsePage: number | typeof NaN = Number(page);
    if (isNaN(parsePage))
      throw new NotAcceptableException(
        this.i18n.t('test.pageNotAceptable', {
          lang: I18nContext.current().lang,
        }),
      );
    if (!isValidObjectId(user))
      throw new NotAcceptableException(
        this.i18n.t('test.idNotAcceptable', {
          lang: I18nContext.current().lang,
        }),
      );

    return { page: parsePage, user };
  }
}
