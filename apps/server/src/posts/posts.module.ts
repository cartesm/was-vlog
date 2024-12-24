import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Posts, PostsSchema } from './schemas/post.schema';
import { ExceptionsService } from 'src/utils/exceptions.service';
import { PostLikes, PostLikeSchema } from 'src/likes/schemas/post.like.schema';

@Module({
  controllers: [PostsController],
  providers: [PostsService, ExceptionsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Posts.name,
        schema: PostsSchema,
      },
    ]),
  ],
})
export class PostsModule {}
