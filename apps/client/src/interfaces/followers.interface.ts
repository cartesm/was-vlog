import { ISubUser } from "./user.interface";

export interface IFollowers {
  createdAt: string;
  follower: ISubUser;
  updatedAt: string;
  __v: number;
  _id: string;
}
