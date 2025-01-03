"use client";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserPosts } from "@/lib/api/posts/posts";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../ui/spiner";
import { useLocale, useTranslations } from "next-intl";
import { Edit, Heart, MessageCircle, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { ISimplePostContent } from "@/interfaces/posts.interface";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { format, formatStr } from "@formkit/tempo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
function UserContent({ userId }: { userId: string }): React.ReactElement {
  const t = useTranslations();
  const [posts, setPosts] = useState<ISimplePostContent[]>([]);
  const [order, setOrder] = useState<number | -1 | 1>(-1);
  const [page, setPage] = useState<number>(1);
  const [bestOrder, setBestOrder] = useState<number>(1);
  const [haveMorePage, setHaveMorePage] = useState<boolean>(true);
  const { errors, set: setErrors, removeAll } = useFetchErrors();

  useEffect(() => {
    setPosts([]);
    setPage(1);
    const fectchPosts = async () => {
      const { data, error }: IRespData<IPaginationData<ISimplePostContent>> =
        await getUserPosts({
          userId,
          page,
          order,
          best: bestOrder,
        });
      if (data) {
        setPosts(data.docs);
        setHaveMorePage(data.hasNextPage);
        return;
      }
      setErrors(error as string[]);
      const clearErrorsTimeout = setTimeout(() => {
        removeAll();
        return clearTimeout(clearErrorsTimeout);
      }, 5000);
    };
    fectchPosts();
  }, [order, bestOrder]);

  const fetchMorePosts = async () => {
    const { data }: IRespData<IPaginationData<ISimplePostContent>> =
      await getUserPosts({
        userId,
        page: page + 1,
        order,
        best: bestOrder,
      });
    if (data) {
      setPosts(posts.concat(data.docs));
      setPage(data.page);
      setHaveMorePage(data.hasNextPage);
    }
  };
  return (
    <div className=" max-w-2xl w-full mx-auto">
      <div className="flex -space-x-px">
        <Button
          onClick={() => {
            setBestOrder(1);
            setOrder(-1);
          }}
          variant="outline"
          className="rounded-r-none focus:z-10"
        >
          Mas Nuevos
        </Button>
        <Button
          onClick={() => {
            setBestOrder(-1);
          }}
          variant="outline"
          className="rounded-none focus:z-10"
        >
          Mejores
        </Button>
        <Button
          onClick={() => {
            setBestOrder(1);
            setOrder(1);
          }}
          variant="outline"
          className="rounded-l-none focus:z-10"
        >
          Mas Viejos
        </Button>
      </div>
      <div className="overflow-hidden">
        {posts && errors.length < 1 && (
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMorePosts}
            hasMore={haveMorePage}
            loader={
              <div className="mx-auto flex items-center justify-center overflow-hidden">
                <Spinner size={"medium"} />
              </div>
            }
            endMessage={
              <span className="mx-auto text-center font-semibold text-lg py-12 block">
                {t("user.posts.endOfContent")}
              </span>
            }
          >
            {posts?.map((post: ISimplePostContent, index) => (
              <PostItem index={index} key={post._id} post={post} edit={true} />
            ))}
          </InfiniteScroll>
        )}
        <div className="flex items-center justify-center mx-auto">
          {errors.map((err, index) => (
            <span className="error-message" key={index}>
              {err}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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

  return (
    <Card
      className={` my-4 p-4 ${index % 2 === 0 ? "bg-background" : "bg-muted"}`}
    >
      <Link href={`/user/${post.user?.username}`}>
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={post.user?.img} alt={post.user?.username} />
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
            variant={`${post.like ? "default" : "ghost"}`}
            size="sm"
            className="flex items-center gap-1 "
          >
            <Heart className="h-4 w-4" />
            <span>{post.likeCount}</span>
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

export default UserContent;
