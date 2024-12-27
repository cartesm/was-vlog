import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Posts } from 'src/posts/schemas/post.schema';
import { Users } from 'src/users/schemas/users.schema';
import * as paginate from 'mongoose-paginate-v2';
export type PostLikeType = HydratedDocument<PostLikes>;

@Schema({ timestamps: true })
export class PostLikes {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: Posts.name,
  })
  post: Types.ObjectId;

  @Prop({
    types: Types.ObjectId,
    required: true,
    unique: false,
    ref: Users.name,
  })
  userId: Types.ObjectId;
}

const schema = SchemaFactory.createForClass(PostLikes);
schema.plugin(paginate);
export const PostLikeSchema = schema;
