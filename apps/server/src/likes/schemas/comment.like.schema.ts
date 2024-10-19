import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import * as paginate from 'mongoose-paginate-v2';
import { Comments } from 'src/comments/schemas/comments.schema';
import { Posts } from 'src/posts/schemas/post.schema';
export type CommentLikeType = HydratedDocument<CommentLike>;

@Schema({ timestamps: true })
export class CommentLike {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: true,
    ref: Comments.name,
  })
  comment: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Posts.name,
    required: true,
    unique: false,
  })
  post: Types.ObjectId;

  @Prop({
    types: Types.ObjectId,
    required: true,
    unique: true,
    ref: Users.name,
  })
  userId: Types.ObjectId;
}

const schema = SchemaFactory.createForClass(CommentLike);
schema.plugin(paginate);
export const CommentLikeSchema = schema;
