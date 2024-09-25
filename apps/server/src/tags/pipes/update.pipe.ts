import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { TagsService } from '../tags.service';

@Injectable()
export class UpdateTagPipe implements PipeTransform {
  constructor(private tagService: TagsService) {}

  async transform(value: { name: string }, metadata: ArgumentMetadata) {
    const { name } = value;
    await this.tagService.getTag(name);
    return name;
  }
}
