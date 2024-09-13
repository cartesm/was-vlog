import { Types, isValidObjectId } from 'mongoose';
import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';
import { ParamId } from '../interfaces/paramId.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class ParseidPipe implements PipeTransform {
  constructor(private readonly i18n: I18nService) {}
  transform(value: ParamId, metadata: ArgumentMetadata): ParamId {
    console.log(I18nContext.current().lang);
    if (!isValidObjectId(value.id))
      throw new NotAcceptableException(
        this.i18n.translate('test.idNotAcceptable', {
          lang: I18nContext.current().lang,
        }),
      );

    return value;
  }
}
