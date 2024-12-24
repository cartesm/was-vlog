import { ISubUser } from "./user.interface";

export interface IComment {
  _id: string;
  post: string;
  user: ISubUser;
  content: string;
  likeCount: number;
  like: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
