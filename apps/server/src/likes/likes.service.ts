import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostLikes, PostLikeType } from './schemas/post.like.schema';
import { PaginateModel, Types } from 'mongoose';
import { CommentLike, CommentLikeType } from './schemas/comment.like.schema';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(PostLikes.name)
    private postLikeModel: PaginateModel<PostLikeType>,
    @InjectModel(CommentLike.name)
    private commentLikeModel: PaginateModel<CommentLikeType>,
    private exceptions: ExceptionsService,
  ) {}

  async likePost(
    userId: Types.ObjectId,
    postId: Types.ObjectId,
  ): Promise<void> {
    const likeMatch: PostLikeType = await this.postLikeModel.findOne({
      post: postId,
      userId,
    });
    if (likeMatch) this.exceptions.throwConflict('test.likes.alreadyExists');
    await new this.postLikeModel({
      post: postId,
      userId,
    }).save();
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
    return;
  }

  //* LIKES DE COMENTARIOS

  async likeComment(
    userId: Types.ObjectId,
    commentId: Types.ObjectId,
    postId: Types.ObjectId,
  ): Promise<void> {
    const likeMatch: CommentLikeType = await this.commentLikeModel.findOne({
      comment: commentId,
      userId,
    });

    if (likeMatch)
      this.exceptions.throwConflict('test.likes.alreadyExistsComment');
    await new this.commentLikeModel({
      comment: commentId,
      userId,
      post: postId,
    }).save();

    return;
  }
  async getAllLikesInAPost(
    user: Types.ObjectId,
    post: Types.ObjectId,
  ): Promise<Array<{ _id: Types.ObjectId }>> {
    return await this.commentLikeModel
      .find({ userId: user, post })
      .select('_id');
  }
  async getAllCommentLikes(user: Types.ObjectId, page: number): Promise<any> {
    return await this.commentLikeModel.paginate(
      { userId: user },
      {
        limit: 50,
        page,
        populate: {
          path: 'userId post',
          select: 'username img name',
        },
        select: 'userId createAt post',
      },
    );
  }
  async dislikeComment(
    user: Types.ObjectId,
    comment: Types.ObjectId,
  ): Promise<void> {
    await this.commentLikeModel.findOneAndDelete({ userId: user, comment });
    return;
  }
}
