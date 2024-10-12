import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostLikes, PostLikeSchema } from './schemas/post.like.schema';

@Module({
  controllers: [LikesController],
  providers: [LikesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: PostLikes.name,
        schema: PostLikeSchema,
      },
    ]),
  ],
})
export class LikesModule {}
