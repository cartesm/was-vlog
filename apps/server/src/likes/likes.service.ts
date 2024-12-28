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
  ): Promise<{ status: 'Create' | 'Delete' }> {
    const likeMatch: PostLikeType = await this.postLikeModel.findOne({
      post: postId,
      userId,
    });
    if (likeMatch) {
      await this.postLikeModel.findOneAndDelete({
        post: postId,
        userId: userId,
      });
      return { status: 'Delete' };
    }
    await new this.postLikeModel({
      post: postId,
      userId,
    }).save();
    return { status: 'Create' };
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

  //* LIKES DE COMENTARIOS

  async likeComment(
    userId: Types.ObjectId,
    commentId: Types.ObjectId,
    postId: Types.ObjectId,
  ): Promise<{ status: 'Create' | 'Delete' }> {
    const likeMatch: CommentLikeType = await this.commentLikeModel.findOne({
      comment: commentId,
      userId,
      post: postId,
    });

    if (likeMatch) {
      await this.commentLikeModel.findOneAndDelete({
        userId,
        comment: commentId,
      });
      return { status: 'Delete' };
    }
    await new this.commentLikeModel({
      comment: commentId,
      userId,
      post: postId,
    }).save();

    return { status: 'Create' };
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
}
