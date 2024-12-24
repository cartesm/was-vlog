import { AxiosResponse } from "axios";
import axios from "../axios";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import {
  ICompletePost,
  ICreatePost,
  ISimplePostContent,
  IUpdatePost,
} from "@/interfaces/posts.interface";

export const getUserPosts = async (options: {
  userId: string;
  page: number;
  order: number;
  best: number;
}): Promise<IRespData<IPaginationData<ISimplePostContent>>> => {
  const { order, page, userId, best } = options;
  try {
    const resp: AxiosResponse = await axios.get(
      `/posts/user/${userId}/${page}?order=${order}&best=${best}`
    );
    return { data: resp.data as IPaginationData<ISimplePostContent> };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export const createPost = async (
  data: ICreatePost
): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.post("/posts", data);
    console.log(resp.data);

    return {
      data: resp.data.message,
    };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export const updatePost = async (
  data: IUpdatePost,
  name: string
): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.put(`/posts/${name}`, data);
    return {
      data: resp.data.message,
    };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export const getOnePost = async (
  name: string
): Promise<IRespData<ICompletePost>> => {
  try {
    const resp: AxiosResponse = await axios.get(`/posts/${name}`);
    return { data: resp.data as ICompletePost };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};
