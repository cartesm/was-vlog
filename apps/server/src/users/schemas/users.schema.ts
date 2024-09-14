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

  @Prop({ required: true, unique: false, type: String })
  pass: string;

  @Prop({ type: String, unique: false, required: false })
  img: string;

  @Prop({
    type: String,
    required: false,
    unique: false,
    minlength: 10,
    maxlength: 250,
  })
  description: string;

  //TODO: en futuras actualizaciones agregar mas campos personales como links a otros sitios
}

const schema = SchemaFactory.createForClass(Users);
schema.plugin(paginate);
export const UsersSchema = schema;
