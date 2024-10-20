import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Posts } from 'src/posts/schemas/post.schema';
import { Users } from 'src/users/schemas/users.schema';

export type HistoryType = HydratedDocument<History>;

@Schema()
export class History {
  @Prop({ type: Types.ObjectId, ref: Users.name, required: true, unique: true })
  user: Types.ObjectId;

  @Prop({
    required: true,
    default: [],
    type: [Types.ObjectId],
    ref: Posts.name,
    maxlength: 100,
  })
  history: Types.ObjectId[];
}

export const HistorySchema = SchemaFactory.createForClass(History);
