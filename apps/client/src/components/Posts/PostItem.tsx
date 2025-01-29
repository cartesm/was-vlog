"use client";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { useLocale, useTranslations } from "next-intl";
import { Edit, Heart, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ISimplePostContent } from "@/interfaces/posts.interface";
import { format } from "@formkit/tempo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCallback, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { manageLikePost } from "@/lib/api/posts/likeComment";
import { DebouncedFuncLeading, throttle } from "lodash";
import { validateIsLogedInClient } from "@/lib/validateIsLogedClient";
export const PostItem = ({
  post,
  index,
  edit = false,
}: {
  post: ISimplePostContent;
  index: number;
  edit?: boolean;
}): React.ReactElement => {
  const lang = useLocale();
  const t = useTranslations();
  const [isLiked, setIsLiked] = useState<{ isLike: boolean; count: number }>({
    count: post.likeCount,
    isLike: post.like,
  });

  const handleLike = async () => {
    const isLoged: boolean = validateIsLogedInClient(
      t("auth.loginRequired"),
      t("likes.auth")
    );
    if (!isLoged) return;
    const { error, data: resp }: IRespData<string> = await manageLikePost(
      post._id
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
      setIsLiked((actual) => ({ count: actual.count + 1, isLike: true }));
      return;
    }
    setIsLiked((actual) => ({ count: actual.count - 1, isLike: false }));
  };

  const throttledOnclick: DebouncedFuncLeading<() => void> = useCallback(
    throttle(handleLike, 1500, { trailing: false }),
    []
  );

  return (
    <Card className={` my-4 p-4 bg-background`}>
      <Link href={`/user/${post.user?._id}`}>
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage
              loading="eager"
              src={post.user?.img}
              alt={post.user?.username}
            />
            <AvatarFallback>{post.user?.username}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.user?.username}</p>
          </div>
        </div>
      </Link>
      <div className="flex justify-between items-start mb-2">
        <div>
          <Link href={`/post/${post.name}`}>
            <h3 className="font-semibold text-2xl hover:text-muted-foreground py-2">
              {post.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">
            {format(post.createdAt, "medium", lang)}
          </p>
        </div>
        {edit && (
          <Link href={`/write/${post.name}`}>
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      <p className="text-sm mb-3">
        {post.description.length > 90
          ? `${post.description.slice(0, 90)}...`
          : post.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags?.map((tag) => (
          <Badge key={tag._id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Button
            onClick={throttledOnclick}
            variant={`${isLiked.isLike ? "default" : "ghost"}`}
            size="sm"
            className="flex items-center gap-1 "
          >
            <Heart className="h-4 w-4" />
            <span>{isLiked.count}</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1 text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentCount}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
