import { AxiosResponse } from "axios";
import axios from "./axios";
import { TrainFrontTunnel } from "lucide-react";

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
  userId: string,
  page: number,
  order: number
): Promise<IRespPagination> => {
  try {
    const resp: AxiosResponse = await axios.get(
      `/posts/user/${userId}/${page}?order=${order}`
    );
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

export const updatePost = async (
  data: ICreatePost,
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

export interface IGetPost {
  data?: any;
  errors?: string[] | string;
}

export const getOnePost = async (name: string): Promise<IGetPost> => {
  try {
    const resp: AxiosResponse = await axios.get(`/posts/${name}`);
    console.log(resp);
    return { data: "pene" };
  } catch (e: any) {
    console.log(e);
    return {
      errors: "",
    };
  }
};
