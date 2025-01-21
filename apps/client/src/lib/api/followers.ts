import { IRespData } from "@/interfaces/errorDataResponse.interface";
import axios from "./axios";
import { AxiosResponse } from "axios";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { IFollowers } from "@/interfaces/followers.interface";

export const follow = async (userId: string): Promise<IRespData<string>> => {
  try {
    // {user:othger user}
    const resp: AxiosResponse = await axios.post("/followers/follow", {
      user: userId,
    });
    return { data: resp.data.message };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export const unFollow = async (userId: string): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.delete(
      `/followers/unfollow/${userId}`
    );
    return { data: resp.data.message };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export const getFollowersOf = async ({
  page,
  user,
}: {
  page: number;
  user: string;
}): Promise<IRespData<IPaginationData<IFollowers>>> => {
  try {
    const resp: AxiosResponse = await axios.get(
      `/followers/fu/${page}/${user}`
    );
    return { data: resp.data };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};
