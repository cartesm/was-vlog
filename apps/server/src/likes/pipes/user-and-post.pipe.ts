import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class UserAndPostPipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(value: { user: string; post: string }, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value.user) || !isValidObjectId(value.post))
      throw new NotAcceptableException(this.i18n.t('test.idNotAcceptable'));

    return value;
  }
}
