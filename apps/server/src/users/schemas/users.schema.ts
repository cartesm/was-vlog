import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
export type UsersType = HydratedDocument<Users>;

@Schema()
export class Users {}

const schema = SchemaFactory.createForClass(Users);
schema.plugin(paginate);
export const UsersSchema = schema;
