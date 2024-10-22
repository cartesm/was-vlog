import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { Saved, SavedType } from './schemas/saved.schema';
import { PaginateModel, Types } from 'mongoose';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class SavedService {
  constructor(
    @InjectModel(Saved.name) private savedModel: PaginateModel<SavedType>,
    private i18n: I18nService,
    private exceptions: ExceptionsService,
  ) {}

  async savePost(
    user: Types.ObjectId,
    post: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    if (await this.savedModel.findOne({ user, post }))
      this.exceptions.throwConflict('test.saved.conflict');

    await new this.savedModel({ user, post }).save();
    return {
      message: this.i18n.t('test.saved.saved'),
    };
  }
  async getAllSaved(user: Types.ObjectId, page: number): Promise<any> {
    return await this.savedModel.paginate(
      { user },
      {
        page,
        sort: { createtAt: -1 },
        limit: 20,
        populate: {
          path: 'post',
          select: 'name tags createdAt _id likeCount',
        },
      },
    );
  }
  async deleteSaved(
    user: Types.ObjectId,
    post: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    await this.savedModel.findOneAndDelete({ user, post });
    return {
      message: this.i18n.t('test.saved.delete', {
        lang: I18nContext.current().lang,
      }),
    };
  }
  async getSavesIds(user: Types.ObjectId): Promise<Types.ObjectId[]> {
    return await this.savedModel.find({ user }).select('_id');
  }
}
