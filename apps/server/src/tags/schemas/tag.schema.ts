import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Users } from 'src/users/schemas/users.schema';

export type TagsType = HydratedDocument<Tags>;

@Schema({ timestamps: true })
export class Tags {
  @Prop({
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 15,
  })
  name: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: false,
    ref: Users.name,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    unique: false,
    required: false,
    minlength: 10,
    maxlength: 250,
  })
  description: string;
}

const schema = SchemaFactory.createForClass(Tags);
schema.plugin(paginate);
export const TagsSchema = schema;
