import { Request } from 'express';
import { Payload } from './payload.interface';

export interface UserRequest extends Request {
  user: Payload;
}
