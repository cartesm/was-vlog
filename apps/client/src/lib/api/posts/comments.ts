import { IComment } from "@/interfaces/comment.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IPaginationData } from "@/interfaces/pagination.interface";
import axios from "@/lib/api/axios";
import { AxiosResponse } from "axios";

export const getCommentsOf = async ({
  postId,
  page,
  order,
  respond,
}: {
  postId: string;
  page: number;
  order: number;
  respond?: string;
}): Promise<IRespData<IPaginationData<IComment>>> => {
  try {
    const query: string =
      `/comments/${postId}/${page}?order=${order}` +
      (respond ? `&respond=${respond}` : "");
    const { data } = await axios.get(query);
    return { data };
  } catch (e: any) {
    const errorMessage = Array.isArray(e.response.data.message)
      ? e.response.data.message
      : [e.response.data.message];
    return { error: errorMessage ?? ["Error"] };
  }
};
// content- post - respondTo? - login
export const createComment = async (content: {
  content: string;
  post: string;
  respondTo?: string;
}): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.post("/comments", content);
    console.log(resp.data);
    return { data: "edata" };
  } catch (e: any) {
    console.log(e);
    const errorMessage = Array.isArray(e.response.data.message)
      ? e.response.data.message
      : [e.response.data.message];
    return { error: errorMessage ?? ["Error"] };
  }
};
