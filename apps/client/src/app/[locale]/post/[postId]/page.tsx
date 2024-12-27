import Image from "next/image";
import { ICompletePost } from "@/interfaces/posts.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import PostContent from "@/components/Posts/PostContent";
import Comments from "@/components/comments/Comments";
import { baseUrl } from "@/lib/configs";
import { Metadata } from "next";
import { getAuthToken } from "@/lib/getAuthData";
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
  return (
    <section className="max-w-3xl mx-auto w-full bg-secondary  p-4 rounded-md">
      <PostContent data={data as ICompletePost} />
      <Comments postId={(data as ICompletePost)._id} />
    </section>
  );
}

export default page;
