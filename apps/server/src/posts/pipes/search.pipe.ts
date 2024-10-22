import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class SearchPipe implements PipeTransform {
  constructor(private exceptions: ExceptionsService) {}

  transform(
    value: {
      name: string;
      tags: Array<any>;
      created: number;
      alphabetical: number;
    },
    metadata: ArgumentMetadata,
  ) {
    // * array in param
    // tags[]=tag1 & tags[]=tag2
    //* created default = 1
    //* alphabetical default = 1
    const { alphabetical, created, name, tags } = value;
    const parsedAlphabetical: number | typeof NaN = Number(alphabetical);
    const parsedCreated: number | typeof NaN = Number(created);

    if (isNaN(parsedAlphabetical) || isNaN(parsedCreated))
      this.exceptions.throwUnauthorized('test.orderPageNotNumber');
    if (![-1, 1].includes(parsedAlphabetical))
      this.exceptions.throwNotAceptable('test.orderPageInvalid');
    if (![-1, 1].includes(parsedCreated))
      this.exceptions.throwNotAceptable('test.orderPageInvalid');
    if (tags)
      if (!Array.isArray(tags) || tags.length <= 0)
        this.exceptions.throwNotAceptable('test.pipes.notArrayTags');
      else
        tags.forEach(
          (tag) =>
            !isValidObjectId(tag) &&
            this.exceptions.throwNotAceptable('test.pipes.notMongoIdTag'),
        );

    return {
      alphabetical: parsedAlphabetical,
      created: parsedCreated,
      name,
      tags,
    };
  }
}
