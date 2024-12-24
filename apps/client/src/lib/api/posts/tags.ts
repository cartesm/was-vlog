"use client";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import axios from "../axios";
import { IPaginationData } from "@/interfaces/pagination.interface";

export interface ITags {
  name: string;
  createdAt: Date;
  _id: string;
  createdBy: {
    username: string;
    _id: string;
  };
}

export const searchTags = async (
  page: number,
  order: number,
  value: string
): Promise<IRespData<IPaginationData<ITags>>> => {
  try {
    const { data } = await axios.get(
      `/tags/s/${page}?orderBy=${order}&value=${value}`
    );
    return { data };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};
