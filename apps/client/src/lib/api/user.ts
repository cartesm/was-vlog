"use client";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IUser } from "@/interfaces/user.interface";
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
