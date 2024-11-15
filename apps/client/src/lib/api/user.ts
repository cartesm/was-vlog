"use client";
import axios from "@/lib/api/axios";
import { AxiosResponse } from "axios";

export interface IUser {
  username: string;
  img: string;
  name: string;
  description?: string;
  createdAt: Date;
}
export interface IErrorResp {
  message: string | string[];
}

export interface IUserResp {
  user?: IUser;
  errors?: IErrorResp;
}

export const getLogedUser = async (id: string): Promise<IUserResp> => {
  try {
    const resp: AxiosResponse = await axios.get(`/users/${id}`);
    return { user: <IUser>resp.data };
  } catch (e: unknown) {
    const message: string | string[] = (e as any).response.data.message;
    return { errors: { message } };
  }
};
