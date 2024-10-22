import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class PageAndUserPipe implements PipeTransform {
  constructor(private exceptions: ExceptionsService) {}

  transform(value: { page: number; user: string }, metadata: ArgumentMetadata) {
    const { page, user } = value;

    const parsePage: number | typeof NaN = Number(page);
    if (isNaN(parsePage))
      this.exceptions.throwNotAceptable('test.pageNotAceptable');
    if (parsePage <= 0)
      this.exceptions.throwNotAceptable('test.pageInvalidValue');
    if (!isValidObjectId(user))
      this.exceptions.throwNotAceptable('test.idNotAcceptable');

    return { page: parsePage, user };
  }
}
