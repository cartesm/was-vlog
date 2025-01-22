import * as paginate from 'mongoose-paginate-v2';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Users } from 'src/users/schemas/users.schema';
import * as agregatePaginate from 'mongoose-aggregate-paginate-v2';
export type FollowersType = HydratedDocument<Followers>;

@Schema({ timestamps: true })
export class Followers {
  @Prop({
    unique: false,
    ref: Users.name,
    required: true,
    type: Types.ObjectId,
  })
  user: Types.ObjectId;

  @Prop({
    unique: false,
    ref: Users.name,
    required: true,
    type: Types.ObjectId,
  })
  follower: Types.ObjectId;
}

const schema = SchemaFactory.createForClass(Followers);
schema.plugin(paginate);
schema.plugin(agregatePaginate);
export const FollowersSchema = schema;
