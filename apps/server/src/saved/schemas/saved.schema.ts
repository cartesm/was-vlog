import * as paginate from 'mongoose-paginate-v2';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import { Posts } from 'src/posts/schemas/post.schema';

export type SavedType = HydratedDocument<Saved>;

@Schema({ timestamps: true })
export class Saved {
  @Prop({
    type: Types.ObjectId,
    ref: Users.name,
    required: true,
    unique: false,
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Posts.name,
    required: true,
    unique: false,
  })
  post: Types.ObjectId;
}

const schema = SchemaFactory.createForClass(Saved);
schema.plugin(paginate);
export const SavedSchema = schema;
