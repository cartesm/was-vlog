import { IRespData } from "@/interfaces/errorDataResponse.interface";
import axios from "@/lib/api/axios";
import { AxiosResponse } from "axios";

export const manageLikePost = async (
  postId: string
): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.post(`/likes/p`, { id: postId });
    return { data: resp.data.status };
  } catch (e: any) {
    const errorMessage = Array.isArray(e.response.data.message)
      ? e.response.data.message
      : [e.response.data.message];
    return { error: errorMessage ?? ["Error"] };
  }
};
export const manageLikeComment = async (
  postId: string,
  commentId: string
): Promise<IRespData<string>> => {
  try {
    const resp: AxiosResponse = await axios.post(`/likes/c`, {
      commentId,
      postId,
    });
    return { data: resp.data.status };
  } catch (e: any) {
    const errorMessage = Array.isArray(e.response.data.message)
      ? e.response.data.message
      : [e.response.data.message];
    return { error: errorMessage ?? ["Error"] };
  }
};

/* 

 @HttpCode(HttpStatus.CREATED)
  async likeAComment(
    @Req() req: UserRequest,
    @Body() body: CreateCommentLikeDto,
  ): Promise<{ status: 'Create' | 'Delete' }> {
    return await this.likesService.likeComment(
      req.user.id,
      body.commentId,
      body.postId,
    );*/
