"use client";
import { ICompletePost, TypeRender } from "@/interfaces/posts.interface";
import { Heart, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import Viewer from "@/components/Posts/Viewer";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { toast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";
import { DebouncedFuncLeading, throttle } from "lodash";
import { manageLikePost } from "@/lib/api/posts/likeComment";
import { Button } from "../ui/button";
import { ISubUser } from "@/interfaces/user.interface";
import { format } from "@formkit/tempo";
function PostContent({ data }: { data: ICompletePost }) {
  const [isLiked, setIsLiked] = useState<{ like: boolean; count: number }>({
    count: data.likeCount,
    like: data.like,
  });

  const handleLike = async () => {
    const Cookies = (await import("js-cookie")).default;
    const authToken: string | undefined = Cookies.get("was_auth_token");
    if (!authToken) {
      toast({
        title: "Sesion requerida",
        description: "Inicia seseion para popder dar un like",
      });
      return;
    }

    const { error, data: resp }: IRespData<string> = await manageLikePost(
      data._id
    );

    if (error) {
      toast({
        title: "Like",
        description: error[0],
        variant: "destructive",
      });
      return;
    }
    if (resp == "Create") {
      setIsLiked((actual) => ({ like: !actual.like, count: actual.count + 1 }));
      return;
    }
    setIsLiked((actual) => ({ like: !actual.like, count: actual.count - 1 }));
  };

  const throttledOnclick: DebouncedFuncLeading<() => void> = useCallback(
    throttle(handleLike, 1500, { trailing: false }),
    []
  );

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold py-3">{data.name}</h1>
        <UserPostContent
          onClick={throttledOnclick}
          user={data.user}
          postInfo={{
            createdAt: data.createdAt,
            description: data.description,
            likeCount: isLiked.count,
            tags: data.tags,
            like: isLiked.like,
          }}
        />
      </div>
      <hr />
      <Viewer content={data.content} type={TypeRender.Post} />
      <hr />
      <div className="max-w-2xl py-12 mx-auto">
        <div className="flex items-center justify-start pt-4 gap-2 flex-wrap">
          {data.tags.map((tag) => (
            <Link href={"#"} key={tag._id}>
              <Badge variant={"outline"} className="px-2 py-1">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const UserPostContent = ({
  user,
  postInfo,
  onClick,
}: {
  user: ISubUser;
  postInfo: {
    createdAt: string;
    likeCount: number;
    tags: { _id: string; name: string }[];
    description: string;
    like: boolean;
  };
  onClick: DebouncedFuncLeading<() => void>;
}) => (
  <div className="mx-auto py-8 px-7">
    <div className="flex items-center space-x-4">
      <Avatar className="h-12 w-12 border-2 ">
        <AvatarImage src={user.img} alt="@usuario" />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-bold text-xl">{user.username}</h3>
        <p className="text-sm">{format(postInfo.createdAt, "long")}</p>
      </div>
    </div>

    <div className="mt-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          onClick={onClick}
          variant={`${postInfo.like ? "default" : "ghost"}`}
          size="sm"
          className="flex items-center gap-1 max-h-8 "
        >
          <Heart className="h-4 w-4" />
          <span>{postInfo.likeCount}</span>
        </Button>
        <span className="text-sm"></span>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {postInfo.tags?.map((data, index) => (
          <Link href={"#"} key={index}>
            <span className="text-xs font-medium px-3 py-1 rounded-full border">
              {data.name}
            </span>
          </Link>
        ))}
      </div>
    </div>

    <div className="mt-6 border-t border-gray-200 pt-4">
      <p className=" leading-relaxed">{postInfo.description}</p>
    </div>
  </div>
);

export default PostContent;
