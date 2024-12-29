"use client";

import { useFetchErrors } from "@/hooks/useFetchErrors";

import { FileX2, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IComment } from "@/interfaces/comment.interface";
import { DebouncedFuncLeading, throttle } from "lodash";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { format } from "@formkit/tempo";
import { Button } from "../ui/button";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { getCommentsOf } from "@/lib/api/posts/comments";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../ui/spiner";
import { toast } from "@/hooks/use-toast";
import { manageLikeComment } from "@/lib/api/posts/likeComment";

export default function SubComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const { errors, set: setError, removeAll } = useFetchErrors();
  const [comments, setComments] = useState<IComment[] | null>(null);
  const [page, setPage] = useState<number>(1);
  const [haveMorePage, setHaveMorePage] = useState<boolean>(true);

  const fetchComments = async () => {
    const { data, error }: IRespData<IPaginationData<IComment>> =
      await getCommentsOf({
        page,
        postId,
        order: 1,
        respond: commentId,
      });

    if (error) {
      setError(error);
      return;
    }
    if (!data) return;
    setHaveMorePage(data.hasNextPage);
    setComments(data.docs);
  };

  const fetchMoreComments = async () => {
    const { data, error }: IRespData<IPaginationData<IComment>> =
      await getCommentsOf({
        page,
        postId,
        order: 1,
        respond: commentId,
      });
    if (data) {
      setComments((actual) => (actual as IComment[]).concat(data.docs));
      setPage(data.page);
      setHaveMorePage(data.hasNextPage);
    }
    setError(error as string[]);
    const clearErrorsTimeout = setTimeout(() => {
      removeAll();
      return clearTimeout(clearErrorsTimeout);
    }, 5000);
  };
  const handleLike = async (commentId: string) => {
    const Cookies = (await import("js-cookie")).default;
    const authToken: string | undefined = Cookies.get("was_auth_token");
    if (!authToken) {
      toast({
        title: "Sesion requerida",
        description: "Inicia seseion para popder dar un like",
      });
      return;
    }

    const { error, data: resp }: IRespData<string> = await manageLikeComment(
      postId,
      commentId
    );

    if (error) {
      toast({
        title: "Like",
        description: error[0],
        variant: "destructive",
      });
      return;
    }
    console.log(commentId);
    if (resp == "Create") {
      setComments(
        (actual) =>
          actual?.map((doc) =>
            doc._id == commentId
              ? { ...doc, like: true, likeCount: doc.likeCount + 1 }
              : doc
          ) as IComment[]
      );
      return;
    }
    setComments(
      (actual) =>
        actual?.map((doc) =>
          doc._id == commentId
            ? { ...doc, like: false, likeCount: doc.likeCount - 1 }
            : doc
        ) as IComment[]
    );
  };
  const throttledOnclick: DebouncedFuncLeading<(commentId: string) => void> =
    useCallback(
      throttle((commentId: string) => handleLike(commentId), 1500, {
        trailing: false,
      }),
      []
    );

  useEffect(() => {
    fetchComments();
  }, []);

  if (!comments || comments.length <= 0)
    return (
      <div className="flex gap-3 items-center justify-start py-4 flex-col">
        <div className="flex gap-2 items-center justify-start">
          <FileX2 />
          <span>Nada que mostrar</span>
        </div>
        <div className="flex items-start w-full justify-start flex-col gap-2">
          {errors?.map((err, index) => (
            <span className="error-message" key={index}>
              {err}
            </span>
          ))}
        </div>
      </div>
    );

  return (
    <div className=" pl-12 md:pl-24 pr-6">
      <div className="pb-4">
        <InfiniteScroll
          dataLength={comments.length}
          next={fetchMoreComments}
          hasMore={haveMorePage}
          loader={
            <div className="mx-auto flex items-center justify-center overflow-hidden">
              <Spinner size={"medium"} />
            </div>
          }
          endMessage={
            <span className="mx-auto text-center font-semibold text-lg py-12 block">
              No hay mas nada
            </span>
          }
        >
          {comments.map((comment, index) => (
            <CommentItem
              throttledOnclick={throttledOnclick}
              comment={comment}
              key={index}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

const CommentItem = ({
  comment,
  throttledOnclick,
}: {
  comment: IComment;
  throttledOnclick: DebouncedFuncLeading<(commentId: string) => void>;
  postId?: string;
}) => (
  <Card className="my-2">
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar>
        <AvatarImage src={comment.user.img} alt={comment.user.username} />
        <AvatarFallback>{comment.user.username}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold">{comment.user.username}</h3>
        <p className="text-sm text-gray-500">
          {format(comment.createdAt, "medium")}{" "}
          {comment.createdAt != comment.updatedAt && " - Editado"}
        </p>
      </div>
    </CardHeader>
    <CardContent>
      <p>{comment.content}</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <div className="flex -space-x-px">
        <Button
          variant={comment.like ? "default" : "outline"}
          size="sm"
          onClick={() => throttledOnclick(comment._id)}
          className="focus:z-10"
        >
          <ThumbsUp
            className={`mr-2 h-4 w-4 ${comment.like ? "fill-current" : ""}`}
          />
          {comment.likeCount}
        </Button>
      </div>
    </CardFooter>
  </Card>
);
