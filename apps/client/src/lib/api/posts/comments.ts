import axios from "@/lib/api/axios";

export interface IGetComments<T> {
  data?: T;
  error?: string;
}
export interface PaginationData<T> {
  docs: T[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  page: number;
  pagingCounter: number;
  prevPage: number | null;
  totalDocs: number;
  totalPages: number;
}
interface User {
  img: string;
  _id: string;
  username: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  user: User;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
}): Promise<IGetComments<PaginationData<Comment>>> => {
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
