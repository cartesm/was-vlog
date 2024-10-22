import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class UserAndPostPipe implements PipeTransform {
  constructor(private exception: ExceptionsService) {}

  transform(value: { user: string; post: string }, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value.user) || !isValidObjectId(value.post))
      this.exception.throwNotAceptable('test.idNotAcceptable');

    return value;
  }
}
