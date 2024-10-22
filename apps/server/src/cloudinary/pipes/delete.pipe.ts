import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class DeletePipe implements PipeTransform {
  constructor(private exceptions: ExceptionsService) {}
  transform(value: { name: string }, metadata: ArgumentMetadata) {
    if (!value.name)
      this.exceptions.throwNotAceptable('test.cloudinary.nameNotFound');
    return value.name;
  }
}
