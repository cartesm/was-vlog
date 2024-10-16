import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostLikes, PostLikeType } from './schemas/post.like.schema';
import { PaginateModel, Types } from 'mongoose';
import { ResponseWithMessage } from 'src/utils/interfaces/message.interface';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CommentLike, CommentLikeType } from './schemas/comment.like.schema';
import { CommentsService } from 'src/comments/comments.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(PostLikes.name)
    private postLikeModel: PaginateModel<PostLikeType>,
    @InjectModel(CommentLike.name)
    private commentLikeModel: PaginateModel<CommentLikeType>,
    private i18n: I18nService,
    private postService: PostsService,
    private commentService: CommentsService,
  ) {}

  async likePost(
    userId: Types.ObjectId,
    postId: Types.ObjectId,
  ): Promise<void> {
    const likeMatch: PostLikeType = await this.postLikeModel.findOne({
      post: postId,
      userId,
    });
    if (likeMatch)
      throw new ConflictException(
        this.i18n.t('test.likes.alreadyExists', {
          lang: I18nContext.current().lang,
        }),
      );
    await new this.postLikeModel({
      post: postId,
      userId,
    }).save();
    await this.postService.modifyLikeCount(postId, 1);
    return;
  }

  async getUsersThatLikePost(post: Types.ObjectId, page: number) {
    return await this.postLikeModel.paginate(
      { post },
      {
        limit: 50,
        page,
        populate: {
          path: 'userId',
          select: 'username img',
        },
        select: 'userId createAt',
      },
    );
  }
  async deleteLikePost(
    post: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<void> {
    await this.postLikeModel.findOneAndDelete({
      post,
      userId: user,
    });
    await this.postService.modifyLikeCount(post, -1);
    return;
  }

  async isLikedPost(
    post: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<boolean> {
    const likeMatch: PostLikeType = await this.postLikeModel.findOne({
      post,
      userId: user,
    });
    if (!likeMatch) return false;
    return true;
  }

  //* LIKES DE COMENTARIOS

  async likeComment(
    userId: Types.ObjectId,
    commentId: Types.ObjectId,
  ): Promise<void> {
    const likeMatch: CommentLikeType = await this.commentLikeModel.findOne({
      comment: commentId,
      userId,
    });

    if (likeMatch)
      throw new ConflictException(
        this.i18n.t('test.likes.alreadyExistsComment', {
          lang: I18nContext.current().lang,
        }),
      );
    await new this.commentLikeModel({
      comment: commentId,
      userId,
    }).save();

    await this.commentService.modifyLikeCount(commentId, 1);

    return;
  }
}
