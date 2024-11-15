import { AxiosResponse } from "axios";
import axios from "./axios";
import { IAuthData } from "@/interfaces/authData.interface";
import { getAuthData } from "../getAuthData";
export interface IReturnResponse {
  message: string | string[];
  error?: boolean;
  data?: {
    username?: string;
    name?: string;
    pass?: string;
    email?: string;
    id?: string;
  };
}

export const signInRequest = async (loginData: {
  email: string;
  pass: string;
}): Promise<IReturnResponse> => {
  try {
    const resp: AxiosResponse = await axios.post("/auth/login", loginData);
    return { message: resp.data.message };
  } catch (e: unknown) {
    const message: string = (e as any).response.data.message;
    return { message: message, error: true };
  }
};

export const signUpRequest = async (registerData: {
  username: string;
  name: string;
  pass: string;
  email: string;
}): Promise<IReturnResponse> => {
  try {
    const resp: AxiosResponse = await axios.post(
      "/auth/register",
      registerData
    );
    return { message: resp.data.message, data: { id: "" } };
  } catch (e: unknown) {
    const message: string = (e as any).response.data.message;
    console.error(e);
    return {
      message,
      error: true,
    };
  }
};
