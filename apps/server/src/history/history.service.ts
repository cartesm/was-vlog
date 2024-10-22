import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { History, HistoryType } from './schemas/history.schema';
import { Model, Types } from 'mongoose';
import { AddHistoryItemDto } from './dto/addHistoryItem.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<HistoryType>,
    private i18n: I18nService,
  ) {}

  async addPostToHistory(
    user: Types.ObjectId,
    itemDto: AddHistoryItemDto,
  ): Promise<void> {
    const historyMatch: HistoryType = await this.historyModel
      .findOne({ user })
      .select('history');
    if (historyMatch.history.length > 100) {
      await this.historyModel.findOneAndUpdate(
        { user },
        {
          $push: { history: itemDto.item },
        },
      );
      return;
    }

    const newHistory = historyMatch.history;
    newHistory.push(itemDto.item);
    newHistory.shift();
    await this.historyModel.findOneAndUpdate(
      { user },
      {
        history: newHistory,
      },
    );
    return;
  }
  async getHistory(
    user: Types.ObjectId,
  ): Promise<{ history: Types.ObjectId[] }> {
    return await this.historyModel.findOne({ user }).populate('history');
  }
  async deleteItemOfHistory(
    user: Types.ObjectId,
    item: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    await this.historyModel.findOneAndUpdate(
      { user },
      {
        $pull: { history: item },
      },
    );
    return {
      message: this.i18n.t('test.history.delete', {
        lang: I18nContext.current().lang,
      }),
    };
  }
  async createHistory(user: Types.ObjectId): Promise<void> {
    await new this.historyModel({ user }).save();
    return;
  }
  async deleteAllHistory(user: Types.ObjectId): Promise<ResponseWithMessage> {
    await this.historyModel.findOneAndUpdate({ user }, { history: [] });
    return {
      message: this.i18n.t('test.history.deleteAll', {
        lang: I18nContext.current().lang,
      }),
    };
  }
}
