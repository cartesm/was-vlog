import { AxiosResponse } from "axios";
import axios from "./axios";
interface IReturnResponse {
  message: string;
  error?: boolean;
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
