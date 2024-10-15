import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentSchema } from './schemas/comments.schema';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Comments.name,
        schema: CommentSchema,
      },
    ]),
  ],
})
export class CommentsModule {}
