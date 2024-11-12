import { AxiosResponse } from "axios";
import axios from "./axios";

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
  errors?: string | string[];
}
export interface IPostContent {
  createdAt: Date;
  languaje: string;
  likeCount: number;
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
    console.log(e);
    return { errors: e.message };
  }
};
