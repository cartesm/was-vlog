"use client";
import { AxiosError } from "axios";
import axios from "./axios";
export interface ITagsPagination {
  docs: ITags[];
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

export interface ITags {
  name: string;
  createdAt: Date;
  _id: string;
  createdBy: {
    username: string;
    _id: string;
  };
}
interface ITagResponse {
  errors?: string;
  data?: ITagsPagination;
}
export const searchTags = async (
  page: number,
  order: number,
  value: string
): Promise<ITagResponse> => {
  try {
    const { data }: { data: ITagsPagination } = await axios.get(
      `/tags/s/${page}?orderBy=${order}&value=${value}`
    );
    return { data };
  } catch (e: any) {
    return { errors: e.response.data.message };
  }
};
