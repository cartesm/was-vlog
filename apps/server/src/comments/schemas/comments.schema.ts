import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import * as aggregatePaginnate from 'mongoose-aggregate-paginate-v2';
import { Posts } from 'src/posts/schemas/post.schema';
import { Users } from 'src/users/schemas/users.schema';
export type CommentType = HydratedDocument<Comments>;

@Schema({ timestamps: true })
export class Comments {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: Posts.name,
  })
  post: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: Users.name,
  })
  user: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    unique: false,
    required: false,
    ref: Users.name,
  })
  respondTo: Types.ObjectId;

  @Prop({ type: String, unique: false, required: true, minLength: 1 })
  content: string;
}

const schema = SchemaFactory.createForClass(Comments);
schema.plugin(paginate);
schema.plugin(aggregatePaginnate);
export const CommentSchema = schema;
