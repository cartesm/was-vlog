import { IRespData } from "@/interfaces/errorDataResponse.interface";
import axios from "./axios";
import { AxiosResponse } from "axios";

export const follow = async (userId: string): Promise<IRespData<string>> => {
  try {
    // {user:othger user}
    const resp: AxiosResponse = await axios.post("/followers/follow", {
      user: userId,
    });
    // TODO: validar no poder seguirte a ti mismo
    // TODO: hacer el boton para el dislike
    console.log(resp);
    return { data: "d" };
  } catch (e: any) {
    console.log(e);
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
    console.log(resp);
    return { data: "d" };
  } catch (e: any) {
    console.log(e);
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};
