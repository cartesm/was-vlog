import {
  ArgumentMetadata,
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class SearchPipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  throwNotAceptable(error: string) {
    throw new NotAcceptableException(
      this.i18n.t(error, { lang: I18nContext.current().lang }),
    );
  }

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
      this.throwNotAceptable('test.orderPageNotNumber');
    if (![-1, 1].includes(parsedAlphabetical))
      this.throwNotAceptable('test.orderPageInvalid');
    if (![-1, 1].includes(parsedCreated))
      this.throwNotAceptable('test.orderPageInvalid');
    if (tags)
      if (!Array.isArray(tags) || tags.length <= 0)
        this.throwNotAceptable('test.pipes.notArrayTags');
      else
        tags.forEach(
          (tag) =>
            !isValidObjectId(tag) &&
            this.throwNotAceptable('test.pipes.notMongoIdTag'),
        );

    return {
      alphabetical: parsedAlphabetical,
      created: parsedCreated,
      name,
      tags,
    };
  }
}
