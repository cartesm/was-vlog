import { Types } from 'mongoose';

export interface Payload {
  id: Types.ObjectId;
  email?: string;
  img?: string;
  username: string;
}
