import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Comments, CommentType } from './schemas/comments.schema';
import { PaginateModel, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create.comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private commentModel: PaginateModel<CommentType>,
    private i18n: I18nService,
  ) {}

  async getComments(
    postId: Types.ObjectId,
    page: number,
    orderBy: number,
    respond?: Types.ObjectId,
  ): Promise<any> {
    let query: { post: Types.ObjectId; respondTo?: Types.ObjectId } = {
      post: postId,
    };
    if (respond) query.respondTo = respond;

    return await this.commentModel.paginate(query, {
      page: page,
      populate: {
        path: 'user',
        select: 'username _id img createdAt',
      },
      limit: 30,
      sort: { createdAt: orderBy },
    });
  }

  async createComment(
    userId: Types.ObjectId,
    content: CreateCommentDto,
  ): Promise<any> {
    const commentMatch: CommentType = await this.commentModel.findOne({
      content: content.content,
    });
    if (commentMatch)
      throw new NotAcceptableException(
        this.i18n.t('test.comment.alreadyExists', {
          lang: I18nContext.current().lang,
        }),
      );

    let dataComment: any = {
      user: userId,
      content: content.content,
      post: content.post,
    };
    if (content.respondTo) dataComment.rspondTo = content.respondTo;
    return await new this.commentModel(dataComment).save();
  }
}
