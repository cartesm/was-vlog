import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId, Types } from 'mongoose';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class OrderQueryPipe implements PipeTransform {
  constructor(private exceptions: ExceptionsService) {}

  transform(
    value: { order: number; respond: Types.ObjectId },
    metadata: ArgumentMetadata,
  ) {
    const parsedOrder: number | typeof NaN = Number(value.order);

    if (isNaN(parsedOrder))
      this.exceptions.throwNotAceptable('test.orderPageNotNumber');

    if (![1, -1].includes(parsedOrder))
      this.exceptions.throwNotAceptable('test.orderPageInvalid');
    if (value.respond && !isValidObjectId(value.respond))
      this.exceptions.throwNotAceptable('test.idNotAcceptable');

    return { order: parsedOrder, response: value.respond };
  }
}
