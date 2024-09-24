import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { Tags, TagsType } from './schemas/tag.schema';
import { PaginateModel, Types } from 'mongoose';
import { CreateTagDto } from './dto/createTag.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tags.name) private tagModel: PaginateModel<TagsType>,
    private i18n: I18nService,
  ) {}

  async getTag(tagName: string): Promise<TagsType> {
    const tag: TagsType = await this.tagModel.findOne({
      name: tagName,
    });
    if (!tag)
      throw new NotFoundException(
        this.i18n.t('test.tags.notFound', { lang: I18nContext.current().lang }),
      );
    return tag;
  }

  async createTag(
    tagData: CreateTagDto,
    userId: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    const tagMatch: TagsType = await this.tagModel.findOne({
      name: tagData.name,
    });
    if (tagMatch)
      throw new ConflictException(
        this.i18n.t('test.tags.conflict', { lang: I18nContext.current().lang }),
      );

    const newTag: TagsType = await new this.tagModel({
      ...tagData,
      createdBy: userId,
    }).save();
    return {
      message: this.i18n.t('test.tags.created', {
        lang: I18nContext.current().lang,
      }),
      data: newTag.name,
    };
  }
}
