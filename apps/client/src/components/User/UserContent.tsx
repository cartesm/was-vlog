"use client";
import { getUserPosts } from "@/lib/api/posts/posts";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../ui/spiner";
import { Button } from "../ui/button";
import { ISimplePostContent } from "@/interfaces/posts.interface";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { useTranslations } from "next-intl";
import { PostItem } from "../Posts/PostItem";
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
              <PostItem
                index={index}
                key={post._id}
                post={post}
                edit={
                  post.user?._id == userId &&
                  window.location.href.includes("profile")
                }
              />
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

export default UserContent;
