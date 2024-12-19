import { IGetResp, IPost } from "@/lib/api/posts";
import { baseUrl } from "@/lib/configs";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
const Viewer = dynamic(() => import("@/components/Posts/Viewer"), {
  loading: () => <div>sds</div>,
});
const getOnePost = async (name: string): Promise<IGetResp> => {
  const resp = await fetch(`${baseUrl}/posts/${name}`, { method: "GET" });
  const data = await resp.json();

  if (data.statusCode == 404) {
    return { error: data.message };
  }
  return { data: data as IPost };
};

//TODO: SEO

export enum TypeRender {
  Write = "WRITE",
  Post = "POST",
}

async function page({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const { data, error } = await getOnePost(postId);

  return (
    <section className="max-w-3xl mx-auto w-full bg-secondary  p-4 rounded-md">
      {error && (
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
      )}
      {data && (
        <>
          <div>
            <h1 className="text-3xl font-bold py-3">{data.name}</h1>
            <p className="pl-2 pb-6">{data.description}</p>
            <hr />
          </div>
          <Viewer content={data.content} type={TypeRender.Post} />
          <hr />
          <div className="max-w-2xl py-12 mx-auto">
            <div>
              <span className="mb-3 block">Escrito por</span>
              <Link href={`/user/${data.user.username}`}>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={data.user.img} alt={data.user.username} />
                    <AvatarFallback>{data.user.username}</AvatarFallback>
                  </Avatar>
                  <span className="hover:underline font-bold">
                    {data.user.username}
                  </span>
                </div>
              </Link>
            </div>
            <div className="flex items-center justify-start pt-4 gap-2 flex-wrap">
              {data.tags.map((tag) => (
                <Link href={"#"} key={tag._id}>
                  <Badge variant={"outline"} className="px-2 py-1">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
            <span className="flex gap-2 py-6 text-lg ">
              <ThumbsUp /> {data.likeCount}
            </span>
          </div>
        </>
      )}
    </section>
  );
}

export default page;
