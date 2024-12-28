"use client";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { IconNode, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";
import Skeleton from "@/components/comments/CommentSkeleton";
import { getCommentsOf } from "@/lib/api/posts/comments";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IComment } from "@/interfaces/comment.interface";
import { DebouncedFuncLeading, throttle } from "lodash";
import { toast } from "@/hooks/use-toast";
import { manageLikeComment } from "@/lib/api/posts/likeComment";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spinner } from "../ui/spiner";
import { format } from "@formkit/tempo";

const SubComments = dynamic(() => import("@/components/comments/SubComment"), {
  loading: () => <Skeleton />,
});

function Comments({ postId }: { postId: string }) {
  const { errors, set: setErrors, removeAll } = useFetchErrors();
  const [visibleSubComments, setVisibleSubComments] = useState<string[]>([""]);
  const [comments, setComments] = useState<IComment[] | null>(null);
  const [order, setOrder] = useState<number | -1 | 1>(-1);
  const [page, setPage] = useState<number>(1);
  const [haveMorePage, setHaveMorePage] = useState<boolean>(true);

  const fetchComments = async () => {
    const { error, data }: IRespData<IPaginationData<IComment>> =
      await getCommentsOf({
        page,
        postId,
        order,
      });
    if (error) {
      setErrors(error);
      return;
    }
    if (!data) return alert("dick");
    setHaveMorePage(data.hasNextPage);
    setComments(data.docs);
  };
  useEffect(() => {
    fetchComments();
  }, [order]);

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

  const fetchMoreComments = async () => {
    const { data, error }: IRespData<IPaginationData<IComment>> =
      await getCommentsOf({
        page,
        postId,
        order,
      });
    if (data) {
      setComments((actual) => (actual as IComment[]).concat(data.docs));
      setPage(data.page);
      setHaveMorePage(data.hasNextPage);
    }
    setErrors(error as string[]);
    const clearErrorsTimeout = setTimeout(() => {
      removeAll();
      return clearTimeout(clearErrorsTimeout);
    }, 5000);
  };

  if (!comments || comments.length <= 0)
    return (
      <div>
        <Skeleton />
        <div className="flex p-4 items-center justify-center">
          {errors?.map((err, index) => (
            <span className="error-message" key={index}>
              {err}
            </span>
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <div className="py-4">
        <div className="flex -space-x-px">
          <Button
            onClick={() => {
              setOrder(-1);
            }}
            variant="outline"
            className="rounded-r-none focus:z-10"
          >
            Mas Nuevos
          </Button>
          <Button
            onClick={() => {
              setOrder(1);
            }}
            variant="outline"
            className="rounded-l-none focus:z-10"
          >
            Mas Viejos
          </Button>
        </div>
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
          {comments?.map((comment, index) => (
            <CommentItem
              key={index}
              comment={comment}
              postId={postId}
              removeAll={removeAll}
              setVisibleSubComments={setVisibleSubComments}
              throttledOnclick={throttledOnclick}
              visibleSubComments={visibleSubComments}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

const CommentItem = ({
  comment,
  postId,
  visibleSubComments,
  setVisibleSubComments,
  throttledOnclick,
  removeAll,
}) => {
  return (
    <div className="py-4 my-4 pl-6 border-l-2 flex" key={comment._id}>
      <Link href={`/user/${comment.user.username}`}>
        <Avatar>
          <AvatarImage src={comment.user.img} alt={comment.user.username} />
          <AvatarFallback>{comment.user.username}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="pl-4 flex items-start gap-1 flex-col">
        <span className="text-sm">
          {format(comment.createdAt, "medium")}
          {comment.updatedAt != comment.createdAt && " (Editado)"}
        </span>
        <p>{comment.content}</p>
        <div className="flex gap-2 items-center">
          <Badge
            onClick={() => throttledOnclick(comment._id)}
            variant={"secondary"}
            className={`flex gap-2 text-[15px] items-center justify-center cursor-pointer hover:bg-neutral-300 ${comment.like && "bg-neutral-300 hover:bg-neutral-400"}`}
          >
            <ThumbsUp size={15} />
            {comment.likeCount}
          </Badge>

          {visibleSubComments.some((comm) => comm == comment._id) ? (
            <Button
              onClick={() => {
                setVisibleSubComments((actual) =>
                  actual.filter((commentId) => commentId != comment._id)
                );
                removeAll();
              }}
              variant={"link"}
            >
              Mostrar Menos
            </Button>
          ) : (
            <Button
              onClick={() =>
                setVisibleSubComments((actual) => [...actual, comment._id])
              }
              variant={"link"}
            >
              Ver respuestas
            </Button>
          )}
        </div>
        {visibleSubComments.some((comm) => comm == comment._id) && (
          <SubComments commentId={comment._id} postId={postId} />
        )}
      </div>
    </div>
  );
};

export default Comments;
