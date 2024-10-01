import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class GetUserQuerryPipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  throwUnaceptable(name: string) {
    throw new NotAcceptableException(
      this.i18n.t('test.' + name, {
        lang: I18nContext.current().lang,
      }),
    );
  }

  transform(
    value: { page: number; order: number },
    metadata: ArgumentMetadata,
  ) {
    const { order, page } = value;

    const parsedPage: number | typeof NaN = Number(page);
    const parsedOrder: number | typeof NaN = Number(order);

    if (isNaN(parsedPage)) this.throwUnaceptable('pageNotAceptable');
    if (isNaN(parsedOrder)) this.throwUnaceptable('orderPageNotNumber');
    if (parsedPage <= 0) this.throwUnaceptable('pageInvalidValue');
    if (parsedOrder === 1 || parsedOrder === -1)
      this.throwUnaceptable('orderPageInvalid');

    return { page: parsedPage, order: parsedOrder };
  }
}
