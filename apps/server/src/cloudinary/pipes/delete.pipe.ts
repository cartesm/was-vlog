import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class DeletePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}
  transform(value: { name: string }, metadata: ArgumentMetadata) {
    if (!value.name)
      throw new NotAcceptableException(
        this.i18n.t('test.cloudinary.nameNotFound', {
          lang: I18nContext.current().lang,
        }),
      );
    return value.name;
  }
}
