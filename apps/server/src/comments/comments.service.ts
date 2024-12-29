import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Comments, CommentType } from './schemas/comments.schema';
import { AggregatePaginateModel, PaginateModel, Types } from 'mongoose';
import { CreateCommentDto } from './dto/create.comment.dto';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { UpdateCommentDto } from './dto/update.comment.dto';
import { ExceptionsService } from 'src/utils/exceptions.service';
import { pipeline } from 'stream';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name)
    private commentModel: PaginateModel<CommentType> &
      AggregatePaginateModel<CommentType>,
    private i18n: I18nService,
    private exceptions: ExceptionsService,
  ) {}

  async getComments(
    postId: Types.ObjectId,
    page: number,
    orderBy: number,
    userId: Types.ObjectId,
    respond?: Types.ObjectId,
  ): Promise<any> {
    const query: {
      post: Types.ObjectId;
      respondTo?: Types.ObjectId | { $exists: boolean };
    } = {
      post: postId,
      ...(respond ? { respondTo: respond } : { respondTo: { $exists: false } }),
    };
    console.log(query);
    const aggregate = this.commentModel.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: 'commentlikes',
          let: {
            commentId: { $toString: '$_id' },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$comment', '$$commentId'],
                },
              },
            },
            {
              $project: {
                userId: 1,
              },
            },
          ],
          as: 'likeCount',
        },
      },
      {
        $addFields: {
          like: userId
            ? {
                $in: [
                  userId,
                  {
                    $map: {
                      input: '$likeCount',
                      as: 'likes',
                      in: '$$likes.userId',
                    },
                  },
                ],
              }
            : false,
          likeCount: {
            $size: '$likeCount',
          },
        },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);

    console.log(
      await this.commentModel.aggregate([
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'users',
            let: {
              userId: { $toString: '_id' },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$user', '$$userId'],
                  },
                },
              },
            ],
            as: 'user',
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
        { $limit: 1 },
      ]),
    );
    return await this.commentModel.aggregatePaginate(aggregate, {
      page: page,
      limit: 30,
      sort: { createdAt: orderBy },
    });
  }

  async findOneComment(
    commentId: Types.ObjectId | String,
    user: Types.ObjectId,
  ): Promise<CommentType | null> {
    return await this.commentModel.findOne({ _id: commentId, user });
  }

  async createComment(
    userId: Types.ObjectId,
    content: CreateCommentDto,
  ): Promise<ResponseWithMessage> {
    const commentMatch: CommentType = await this.commentModel.findOne({
      content: content.content,
      post: content.post,
      user: userId,
    });
    if (commentMatch)
      this.exceptions.throwNotAceptable('test.comment.alreadyExists');

    const dataComment: any = {
      user: userId,
      content: content.content,
      post: content.post,
      ...(content.respondTo && { respondTo: content.respondTo }),
    };
    console.log('crear comment');
    console.log(content);
    console.log(dataComment);
    return {
      message: this.i18n.t('test.comment.created'),
      data: await new this.commentModel(dataComment).save(),
    };
  }

  async existComment(
    commentId: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<void> {
    const commentMatch: { _id: Types.ObjectId } =
      await this.commentModel.exists({ _id: commentId, user });

    if (!commentMatch)
      throw new NotFoundException(
        this.i18n.t('test.comment.notFound', {
          lang: I18nContext.current().lang,
        }),
      );
  }

  async deleteComment(
    commentId: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<ResponseWithMessage> {
    await this.existComment(commentId, user);
    await this.commentModel.findOneAndDelete({ _id: commentId, user });
    return { message: this.i18n.t('test.comment.deleted') };
  }

  async getAllCommentOfAnUser(
    user: Types.ObjectId,
    page: number,
    orderBy: number,
  ): Promise<any> {
    return await this.commentModel.paginate(
      { user },
      {
        sort: { createdAt: orderBy },
        page,
        limit: 30,
        populate: {
          path: 'user post',
          select: 'username img name',
        },
      },
    );
  }

  async updatedComment(
    commentId: Types.ObjectId,
    user: Types.ObjectId,
    newData: UpdateCommentDto,
  ): Promise<ResponseWithMessage> {
    return {
      message: this.i18n.t('test.comment.updated', {
        lang: I18nContext.current().lang,
      }),
      data: await this.commentModel.findOneAndUpdate(
        { _id: commentId, user },
        newData,
      ),
    };
  }
}
