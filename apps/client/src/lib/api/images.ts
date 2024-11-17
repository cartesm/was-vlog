import { AxiosResponse } from "axios";
import axios from "./axios";

export interface IRespondImage {
  message: string;
  url?: string;
}

export const uploadImage = async (
  imageData: FormData
): Promise<IRespondImage> => {
  try {
    const resp: AxiosResponse = await axios.post("/cloudinary/img", imageData);
    return { message: resp.data.message, url: resp.data.data };
  } catch (e: any) {
    const message: string = e.response.data.message;
    return { message };
  }
};
