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

  async searchTag(page: number, tagName: string = ''): Promise<any> {
    return await this.tagModel.paginate(
      {
        name: { $regex: tagName },
      },
      {
        sort: {
          name: 1,
        },
        page,
        limit: 30,
        populate: {
          path: 'createdBy',
          select: 'username',
        },
        select: 'name createdBy createdAt -_id',
      },
    );
  }

  async getTag(tagName: string): Promise<TagsType> {
    const tag: TagsType = await this.tagModel
      .findOne({
        name: tagName,
      })
      .select(' -updatedAt -__v  ')
      .populate('createdBy', 'username');
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

  async updateTag(
    tagName: string,
    tagData: CreateTagDto,
  ): Promise<ResponseWithMessage> {
    await this.tagModel.findOneAndUpdate({ name: tagName }, tagData, {
      new: true,
    });

    return {
      message: this.i18n.t('test.tags.put', {
        lang: I18nContext.current().lang,
      }),
    };
  }
}
