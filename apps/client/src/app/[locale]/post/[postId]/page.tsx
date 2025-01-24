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
  {
    loading: () => (
      <div className="p-6 flex items-center justify-center">
        <Spinner size={"medium"} />
      </div>
    ),
  }
);
const ErrorComponent = dynamic(() => import("@/components/ErrorComponent"));
import { IAuthData } from "@/interfaces/authData.interface";
import { Spinner } from "@/components/ui/spiner";
import { getTranslations } from "next-intl/server";
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

async function Page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const { data, error } = await getOnePost(postId);
  const t = await getTranslations();
  if (error && !data)
    return (
      <ErrorComponent
        error={Array.isArray(error) ? error : [error]}
        status={404}
      />
    );
  const user: IAuthData | null = await getAuthData();
  return (
    <section className="max-w-3xl mx-auto w-full bg-secondary  p-4 rounded-md">
      <PostContent data={data as ICompletePost} />
      <h3 className="font-semibold text-2xl py-3">{t("comments.title")}</h3>
      <CreateComment postId={(data as ICompletePost)._id} user={user} />
      <Comments postId={(data as ICompletePost)._id} />
    </section>
  );
}

export default Page;
