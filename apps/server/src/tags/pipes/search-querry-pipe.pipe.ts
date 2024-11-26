import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class SearchQuerryPipePipe implements PipeTransform {
  constructor(private exceptions: ExceptionsService) {}

  transform(
    value: { value: string; orderBy: number },
    metadata: ArgumentMetadata,
  ) {
    const { orderBy, value: tagValue } = value;
    const parsedOrder: number | typeof NaN = Number(orderBy);

    if (isNaN(parsedOrder))
      this.exceptions.throwNotAceptable('test.pageNotAceptable');
    if (![1, -1].includes(parsedOrder))
      this.exceptions.throwNotAceptable('test.orderPageInvalid');

    return { value: tagValue, orderBy: parsedOrder };
  }
}
