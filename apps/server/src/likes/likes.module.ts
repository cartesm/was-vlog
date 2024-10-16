import { Module, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostLikes, PostLikeSchema } from './schemas/post.like.schema';
import { CommentLike, CommentLikeSchema } from './schemas/comment.like.schema';
import { CommentsService } from 'src/comments/comments.service';
import { PostsService } from 'src/posts/posts.service';
import { Posts, PostsSchema } from 'src/posts/schemas/post.schema';
import { Comments, CommentSchema } from 'src/comments/schemas/comments.schema';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PostsService, CommentsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: PostLikes.name,
        schema: PostLikeSchema,
      },
      {
        name: CommentLike.name,
        schema: CommentLikeSchema,
      },
      {
        name: Posts.name,
        schema: PostsSchema,
      },
      {
        name: Comments.name,
        schema: CommentSchema,
      },
    ]),
  ],
})
export class LikesModule {}
