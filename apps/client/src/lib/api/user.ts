"use client";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IUpdateUser, IUser } from "@/interfaces/user.interface";
import axios from "@/lib/api/axios";
import { AxiosResponse } from "axios";

export const getLogedUser = async (id: string): Promise<IRespData<IUser>> => {
  try {
    const resp: AxiosResponse = await axios.get(`/users/${id}`);
    return { data: <IUser>resp.data };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export const updateUser = async (
  data: IUpdateUser
): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.put("/users/edit", data);
    return { data: resp.data.message };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export const updateProfileImage = async (
  data: FormData
): Promise<IRespData<{ data: string; message: string }>> => {
  try {
    const resp: AxiosResponse = await axios.post("/users/image", data);
    return {
      data: {
        data: resp.data.data,
        message: resp.data.message,
      },
    };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};
