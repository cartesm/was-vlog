"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserPosts, IPostContent, IRespPagination } from "@/lib/api/posts";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../ui/spiner";
import { useTranslations } from "next-intl";
function UserContent({ userId }: { userId: string }): React.ReactElement {
  const t = useTranslations();
  const [posts, setPosts] = useState<IPostContent[]>([]);
  const [order, setOrder] = useState<number | -1 | 1>(-1);
  const [page, setPage] = useState<number>(1);
  const [haveMorePage, setHaveMorePage] = useState<boolean>(true);
  const [errorFetch, setErrorFetch] = useState<string>("");
  useEffect(() => {
    setPosts([]);
    setPage(1);
    const fectchPosts = async () => {
      const { data, errors }: IRespPagination = await getUserPosts(
        userId,
        page,
        order
      );
      if (data) {
        setPosts(data.docs);
        setHaveMorePage(data.hasNextPage);
        return;
      }
      setErrorFetch(errors ? errors : "");
      const clearErrorsTimeout = setTimeout(() => {
        setErrorFetch("");
        return clearTimeout(clearErrorsTimeout);
      }, 5000);
    };
    fectchPosts();
  }, [order]);

  const fetchMorePosts = async () => {
    const { data }: IRespPagination = await getUserPosts(
      userId,
      page + 1,
      order
    );
    if (data) {
      setPosts(posts.concat(data.docs));
      setPage(data.page);
      setHaveMorePage(data.hasNextPage);
    }
  };
  // ? -1 mas nuevo primero
  // ? mas viejo primero
  return (
    <div className="grid grid-cols-1 gap-4">
      <Select
        defaultValue={order.toString()}
        onValueChange={(nValue: string) => setOrder(Number(nValue))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("user.posts.orderBy")}</SelectLabel>
            <SelectItem value="1">{t("user.posts.new")}</SelectItem>
            <SelectItem value="-1">{t("user.posts.old")}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <h2 className="text-2xl font-bold mb-4">{t("user.posts.contentOf")}</h2>
      <div className="overflow-hidden">
        {posts && !errorFetch && (
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
            {posts &&
              posts.map((post: IPostContent) => (
                <PostItem key={post._id} post={post} />
              ))}
          </InfiniteScroll>
        )}
        <div className="flex items-center justify-center mx-auto">
          <span className="error-message ">{errorFetch}</span>
        </div>
      </div>
    </div>
  );
}

const PostItem = ({ post }: { post: IPostContent }): React.ReactElement => {
  return (
    <Card className="my-3">
      <CardHeader>
        <CardTitle>{post.name}</CardTitle>
        <CardDescription>
          {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {post.description && <div className="mb-3">{post.description}</div>}
          <div className="flex items-center justify-start gap-2">
            <Badge variant="secondary">{post.likeCount} likes</Badge>
            {post.tags.map((tag: { name: string; _id: string }) => (
              <Badge key={tag._id} variant={"outline"}>
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserContent;
