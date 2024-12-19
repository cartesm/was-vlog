import { AxiosResponse } from "axios";
import axios from "./axios";

export enum TypePagination {
  Normal = "NORMMAL",
  Best = "BEST",
}

export interface IPostPagination {
  docs: IPostContent[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  prevPage: number | null;
  page: number;
  pagingCounter: number;
  totalDocs: number;
  totalPages: number;
}

export interface IRespPagination {
  data?: IPostPagination;
  errors?: string;
}
export interface IPostContent {
  createdAt: Date;
  languaje: string;
  likeCount: number;
  description: string;
  name: string;
  tags: [
    {
      name: string;
      _id: string;
    },
  ];
  _id: string;
}

export const getUserPosts = async (
  options: {
    userId: string;
    page: number;
    order: number;
  },
  type: TypePagination
): Promise<IRespPagination> => {
  const { order, page, userId } = options;
  try {
    let resp: AxiosResponse;
    if (type == TypePagination.Normal)
      resp = await axios.get(`/posts/user/${userId}/${page}?order=${order}`);
    else if (type == TypePagination.Best)
      resp = await axios.get(`/posts/best/${userId}/${page}`);
    else throw new Error();
    return { data: resp.data as IPostPagination };
  } catch (e: any) {
    return { errors: e.response.data.message };
  }
};

export interface ICreatePost {
  content: string;
  tags?: { _id: string }[];
  name: string;
  description: string;
  languaje: string;
}
export interface IResponseCreate {
  message: string[];
  error: boolean;
}

export const createPost = async (
  data: ICreatePost
): Promise<IResponseCreate> => {
  try {
    const resp: AxiosResponse = await axios.post("/posts", data);
    console.log(resp.data);

    return {
      error: false,
      message: resp.data.message,
    };
  } catch (e: any) {
    let message = e.response.data.message;
    message = Array.isArray(message) ? message : [message];
    return {
      error: true,
      message,
    };
  }
};

export interface IUpdatePost {
  content?: string;
  tags?: { _id: string }[];
  description?: string;
  languaje?: string;
  name?: string;
}

export const updatePost = async (
  data: IUpdatePost,
  name: string
): Promise<IResponseCreate> => {
  try {
    const resp: AxiosResponse = await axios.put(`/posts/${name}`, data);
    return {
      error: false,
      message: resp.data.message,
    };
  } catch (e: any) {
    let message = e.response.data.message;
    message = Array.isArray(message) ? message : [message];
    return {
      error: true,
      message,
    };
  }
};

export interface IGetResp {
  error?: string[];
  data?: IPost;
}

interface IPostUser {
  img: string;
  name: string;
  username: string;
  _id: string;
}

export interface IPost {
  content: string;
  createdAt: string;
  description: string;
  languaje: string;
  likeCount: number;
  name: string;
  tags: { name: string; _id: string }[];
  length: number;
  updatedAt: string;
  user: IPostUser;
  _id: string;
  __v: number;
}

export const getOnePost = async (name: string): Promise<IGetResp> => {
  try {
    const resp: AxiosResponse = await axios.get(`/posts/${name}`);
    console.log(resp.data);
    return { data: resp.data as IPost };
  } catch (e: any) {
    console.log(e);
    let message = e.response.data.message;
    message = Array.isArray(message) ? message : [message];
    return {
      error: message,
    };
  }
};
