import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class SearchTagPipe implements PipeTransform {
  constructor(private exceptions: ExceptionsService) {}
  async transform(value: { page: number }, metadata: ArgumentMetadata) {
    const parsePage: number | typeof NaN = Number(value.page);
    if (isNaN(parsePage))
      this.exceptions.throwNotAceptable('test.pageNotAceptable');
    if (parsePage <= 0)
      this.exceptions.throwNotAceptable('test.pageInvalidValue');
    return parsePage;
  }
}
