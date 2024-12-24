import { AxiosResponse } from "axios";
import axios from "./axios";
import { IRespData } from "@/interfaces/errorDataResponse.interface";

export const signInRequest = async (loginData: {
  email: string;
  pass: string;
}): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.post("/auth/login", loginData);
    return { data: resp.data.message };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export const signUpRequest = async (registerData: {
  username: string;
  name: string;
  pass: string;
  email: string;
}): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.post(
      "/auth/register",
      registerData
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
