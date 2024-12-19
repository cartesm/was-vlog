import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ExceptionsService } from 'src/utils/exceptions.service';
import { IPageAndId } from '../interfaces/pageAndId.interface';

@Injectable()
export class PageAndIdPipe implements PipeTransform {
  constructor(private exceptions: ExceptionsService) {}

  transform(value: IPageAndId, metadata: ArgumentMetadata) {
    const { page, id } = value;

    const parsePage: number | typeof NaN = Number(page);
    if (isNaN(parsePage))
      this.exceptions.throwNotAceptable('test.pageNotAceptable');
    if (parsePage <= 0)
      this.exceptions.throwNotAceptable('test.pageInvalidValue');
    console.log(id + ': id valida: ' + isValidObjectId(id));
    if (!isValidObjectId(id))
      this.exceptions.throwNotAceptable('test.idNotAcceptable');

    return { page: parsePage, id };
  }
}
