import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class GetPostQueryPipe implements PipeTransform {
  constructor(private exceptions: ExceptionsService) {}
  transform(
    value: { order: number; best: number },
    metadata: ArgumentMetadata,
  ) {
    const { best, order } = value;
    const bestParsed: number | typeof NaN = Number(best);
    const orderParsed: number | typeof NaN = Number(order);

    if (isNaN(orderParsed) || isNaN(bestParsed))
      this.exceptions.throwUnauthorized('test.orderPageNotNumber');
    if (![-1, 1].includes(bestParsed))
      this.exceptions.throwNotAceptable('test.orderPageInvalid');
    if (![-1, 1].includes(orderParsed))
      this.exceptions.throwNotAceptable('test.orderPageInvalid');

    return { order: orderParsed, best: bestParsed };
  }
}
