import Image from "next/image";
import { ICompletePost } from "@/interfaces/posts.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import PostContent from "@/components/Posts/PostContent";
import Comments from "@/components/comments/Comments";
import { baseUrl } from "@/lib/configs";
import { Metadata } from "next";
import { getAuthData, getAuthToken } from "@/lib/getAuthData";
import dynamic from "next/dynamic";
const CreateComment = dynamic(
  () => import("@/components/comments/CreateComment"),
  { loading: () => <div>crear comentario</div> }
);
import { IAuthData } from "@/interfaces/authData.interface";
export const metadata: Metadata = {
  title: "post",
};

const getOnePost = async (name: string): Promise<IRespData<ICompletePost>> => {
  const token: string | undefined = await getAuthToken();
  const resp: Response = await fetch(`${baseUrl}/posts/${name}`, {
    method: "GET",
    credentials: "include",
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  });
  const data = await resp.json();
  if (resp.status == 404) {
    return { error: data.message };
  }
  return { data: data as ICompletePost };
};

async function page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const { data, error } = await getOnePost(postId);

  if (error)
    return (
      <section className="max-w-3xl mx-auto w-full bg-secondary  p-4 rounded-md">
        <div className="flex items-center justify-center gap-3 flex-col">
          <Image
            src={"https://http.cat/404"}
            width={400}
            height={400}
            alt="No Content"
            className="rounded-md"
          />
          <span className="error-message">{error}</span>
        </div>
      </section>
    );
  const user: IAuthData | null = await getAuthData();
  return (
    <section className="max-w-3xl mx-auto w-full bg-secondary  p-4 rounded-md">
      <PostContent data={data as ICompletePost} />
      <h3 className="font-semibold text-2xl py-3">Comentarios</h3>
      <CreateComment user={user} />
      <Comments postId={(data as ICompletePost)._id} />
    </section>
  );
}

export default page;
