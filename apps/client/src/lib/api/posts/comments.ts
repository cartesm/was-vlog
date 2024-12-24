import { IComment } from "@/interfaces/comment.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IPaginationData } from "@/interfaces/pagination.interface";
import axios from "@/lib/api/axios";

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
