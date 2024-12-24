import { ISubUser } from "./user.interface";

export interface ISimplePostContent {
  createdAt: Date;
  languaje: string;
  description: string;
  name: string;
  like: boolean;
  likeCount: number;
  commentCount: number;
  tags: [
    {
      name: string;
      _id: string;
    },
  ];
  _id: string;
}

export interface ICreatePost {
  content: string;
  tags?: string[];
  name: string;
  description: string;
  languaje: string;
}

export interface IUpdatePost {
  content?: string;
  tags?: string[];
  description?: string;
  languaje?: string;
  name?: string;
}

export interface ICompletePost {
  content: string;
  createdAt: string;
  description: string;
  languaje: string;
  likeCount: number;
  like: boolean;
  name: string;
  tags: { name: string; _id: string }[];
  length: number;
  updatedAt: string;
  user: ISubUser;
  _id: string;
  __v: number;
}
