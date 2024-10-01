import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Tags } from 'src/tags/schemas/tag.schema';
import { Users } from 'src/users/schemas/users.schema';
import { PostItemEnum, PostSubItemEnum } from '../enums/posts.enum';
import { LanguajeEnum } from 'src/utils/enums/languaje.enums';

export type PostsType = HydratedDocument<Posts>;

class ContentSubItemConfigs {
  @Prop({
    type: Number,
    required: false,
    unique: false,
    min: 0,
    max: 10000,
    default: 250,
  })
  width?: number;

  @Prop({
    type: Number,
    required: false,
    unique: false,
    min: 0,
    max: 10000,
    default: 250,
  })
  height?: number;

  @Prop({ type: String, unique: false, required: false })
  url?: string;
}

class ContentSubItem {
  @Prop({ type: String, required: true, enum: PostSubItemEnum, unique: true })
  type: string;

  @Prop({ type: String, unique: false, required: true })
  value: string;

  @Prop({ type: ContentSubItemConfigs, required: false, unique: false })
  configs?: ContentSubItemConfigs;
}

class ContentItem {
  @Prop({
    enum: PostItemEnum,
    type: String,
    required: true,
    default: 'PARAGRAPH',
  })
  type: string;

  @Prop({ type: [ContentSubItem], unique: false, required: true })
  content: ContentSubItem[];
}

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

  @Prop({ required: true, type: [ContentItem], unique: false })
  content: ContentItem[];

  @Prop({ enum: LanguajeEnum, type: String, required: true, unique: false })
  languaje: string;
}

const schema = SchemaFactory.createForClass(Posts);
schema.plugin(paginate);
export const PostsSchema = schema;
