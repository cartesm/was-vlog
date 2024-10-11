import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Tags } from 'src/tags/schemas/tag.schema';
import { Users } from 'src/users/schemas/users.schema';
import { PostItemEnum, PostSubItemEnum } from '../enums/posts.enum';
import { LanguajeEnum } from 'src/utils/enums/languaje.enums';

export type PostsType = HydratedDocument<Posts>;

@Schema({ timestamps: true })
export class Posts {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 150,
  })
  name: string;

  @Prop({
    required: true,
    unique: false,
    ref: Users.name,
    type: Types.ObjectId,
  })
  user: Types.ObjectId;

  @Prop({
    required: false,
    unique: false,
    minlength: 10,
    maxlength: 200,
    type: String,
  })
  description: string;

  @Prop({
    type: [Types.ObjectId],
    ref: Tags.name,
    required: false,
    unique: false,
  })
  tags: Types.ObjectId[];

  @Prop({ required: true, minlength: 200, type: String, unique: false })
  content: string;

  @Prop({ enum: LanguajeEnum, type: String, required: true, unique: false })
  languaje: string;

  @Prop({ required: true, unique: false, type: Number, default: 0 })
  likeCount: Number;
}

const schema = SchemaFactory.createForClass(Posts);
schema.plugin(paginate);
export const PostsSchema = schema;
