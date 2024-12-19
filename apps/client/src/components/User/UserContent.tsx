"use client";
import { Link } from "@/i18n/routing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getUserPosts,
  IPostContent,
  IRespPagination,
  TypePagination,
} from "@/lib/api/posts";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../ui/spiner";
import { useTranslations } from "next-intl";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
function UserContent({ userId }: { userId: string }): React.ReactElement {
  const t = useTranslations();
  const [posts, setPosts] = useState<IPostContent[]>([]);
  const [order, setOrder] = useState<number | -1 | 1>(-1);
  const [page, setPage] = useState<number>(1);
  const [typeSearch, setTypeSearch] = useState<TypePagination>(
    TypePagination.Normal
  );
  const [haveMorePage, setHaveMorePage] = useState<boolean>(true);
  const [errorFetch, setErrorFetch] = useState<string>("");
  useEffect(() => {
    setPosts([]);
    setPage(1);
    const fectchPosts = async () => {
      const { data, errors }: IRespPagination = await getUserPosts(
        {
          userId,
          page,
          order,
        },
        typeSearch
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
  }, [order, typeSearch]);

  const fetchMorePosts = async () => {
    const { data }: IRespPagination = await getUserPosts(
      {
        userId,
        page: page + 1,
        order,
      },
      typeSearch
    );
    if (data) {
      setPosts(posts.concat(data.docs));
      setPage(data.page);
      setHaveMorePage(data.hasNextPage);
    }
  };
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex -space-x-px">
        <Button
          onClick={() => {
            setTypeSearch(TypePagination.Normal);
            setOrder(-1);
          }}
          variant="outline"
          className="rounded-r-none focus:z-10"
        >
          Mas Nuevos
        </Button>
        <Button
          onClick={() => {
            setTypeSearch(TypePagination.Best);
          }}
          variant="outline"
          className="rounded-none focus:z-10"
        >
          Mejores
        </Button>
        <Button
          onClick={() => {
            setTypeSearch(TypePagination.Normal);
            setOrder(1);
          }}
          variant="outline"
          className="rounded-l-none focus:z-10"
        >
          Mas Viejos
        </Button>
      </div>
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
    <Card className="mt-3">
      <CardHeader>
        <CardTitle>
          <Link
            href={`/post/${post.name}`}
            target="_blank"
            className="hover:underline"
          >
            {post.name}
          </Link>
        </CardTitle>
        <CardDescription>
          {new Date(post.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {post.description && <div className="">{post.description}</div>}
          <div className="flex items-center justify-between gap-2">
            <Badge variant="secondary">{post.likeCount} likes</Badge>
            {post.tags.map((tag: { name: string; _id: string }) => (
              <Badge key={tag._id} variant={"outline"}>
                {tag.name}
              </Badge>
            ))}
            <Link href={`/write/${post.name}`} target="_blank">
              <Edit />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserContent;
