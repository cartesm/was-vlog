import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
export type UsersType = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop({
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 27,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: false,
    minlength: 6,
    maxlength: 60,
  })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: false, type: String })
  pass: string;

  @Prop({
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    type: String,
    unique: false,
    required: false,
  })
  img: string;

  @Prop({
    type: String,
    required: false,
    unique: false,
    minlength: 10,
    maxlength: 250,
  })
  description: string;
}

const schema = SchemaFactory.createForClass(Users);
schema.plugin(paginate);
export const UsersSchema = schema;
