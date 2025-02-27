import {
  ICompletePost,
  ISimplePostContent,
} from "@/interfaces/posts.interface";
import {
  IErrorResp,
  IRespData,
} from "@/interfaces/errorDataResponse.interface";
import PostContent from "@/components/Posts/PostContent";
import Comments from "@/components/comments/Comments";
import { baseUrl } from "@/lib/configs";
import { getAuthData, getAuthToken } from "@/lib/getAuthData";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
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
import { Props } from "@/interfaces/props.interface";
import { getLocaleToken } from "@/lib/getLocaleCookie";
import { getLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: Props<{ postId: string }>): Promise<Metadata> {
  const id = (await params).postId;
  const locale: string | undefined = await getLocaleToken();
  console.log(locale);
  const post: ISimplePostContent & IErrorResp = await fetch(
    `${baseUrl}/posts/metadata/${id}`,
    {
      ...(locale && {
        headers: {
          "Accept-Language": locale,
        },
      }),
    }
  ).then((res) => res.json());
  if (post.statusCode) {
    return {
      title: `${post.statusCode} | ${id.replaceAll("%20", " ")}`,
      description: post.message,
    };
  }

  return {
    title: "WAS | " + post.name,
    description: post.description,
    openGraph: {
      title: "WAS | " + post.name,
      description: post.description,
      siteName: "Write any sh*t",
      locale: post.languaje,
      type: "article",
    },
    ...(post.tags?.length <= 0 && {
      keywords: post.tags?.map((tag) => tag.name),
    }),
    authors: [
      {
        name: post.user?.username,
        url: `http://localhost:3000/user/${post.user?._id}`,
      },
    ],
  };
}

const getOnePost = async (name: string): Promise<IRespData<ICompletePost>> => {
  const token: string | undefined = await getAuthToken();
  const locale: string = await getLocale();
  const resp: Response = await fetch(`${baseUrl}/posts/${name}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      "Accept-Language": locale,
    },
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
