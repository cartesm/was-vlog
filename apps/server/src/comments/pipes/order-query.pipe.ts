import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class OrderQueryPipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(
    value: { order: number; respond: Types.ObjectId },
    metadata: ArgumentMetadata,
  ) {
    const parsedOrder: number | typeof NaN = Number(value.order);

    if (isNaN(parsedOrder))
      throw new NotAcceptableException(
        this.i18n.t('test.orderPageNotNumber', {
          lang: I18nContext.current().lang,
        }),
      );
    if (![1, -1].includes(parsedOrder))
      throw new NotAcceptableException(
        this.i18n.t('test.orderPageInvalid', {
          lang: I18nContext.current().lang,
        }),
      );

    if (value.respond && isValidObjectId(value.respond))
      throw new NotAcceptableException(
        this.i18n.t('test.idNotAcceptable', {
          lang: I18nContext.current().lang,
        }),
      );

    return { order: parsedOrder, response: value.respond };
  }
}
