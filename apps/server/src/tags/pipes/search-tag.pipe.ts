import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class SearchTagPipe implements PipeTransform {
  async transform(value: { page: number }, metadata: ArgumentMetadata) {
    const parsePage: number | typeof NaN = Number(value.page);
    if (isNaN(parsePage)) throw new NotAcceptableException();

    return parsePage;
  }
}
