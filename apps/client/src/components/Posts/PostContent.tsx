import { ICompletePost, TypeRender } from "@/interfaces/posts.interface";
import { ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import Viewer from "@/components/Posts/Viewer";

function PostContent({ data }: { data: ICompletePost }) {
  return (
    <div>
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
        <Badge
          variant={"secondary"}
          className=" text-[15px] my-3 cursor-pointer hover:bg-neutral-300"
        >
          <Badge
            variant={"secondary"}
            className={`flex gap-2 text-[15px] items-center justify-center cursor-pointer hover:bg-neutral-300 ${data.like && "bg-neutral-300 hover:bg-neutral-400"}`}
          >
            <ThumbsUp size={15} />
            {data.likeCount}
          </Badge>
        </Badge>
      </div>
    </div>
  );
}

export default PostContent;
