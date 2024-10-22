import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentSchema } from './schemas/comments.schema';
import { ExceptionsService } from 'src/utils/exceptions.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, ExceptionsService],
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
