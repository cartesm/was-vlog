"use client";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { Heart, XCircle } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
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
import { format } from "@formkit/tempo";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useTranslations } from "next-intl";
const NoMoreComponent = dynamic(() => import("@/components/NoMoreContent"));
const ModalCreateComment = dynamic(
  () => import("@/components/comments/ModalCreateComment")
);

function Comments({
  postId,
  commentId,
}: {
  postId: string;
  commentId?: string;
}) {
  const { errors, set: setErrors, removeAll } = useFetchErrors();
  const [visibleSubComments, setVisibleSubComments] = useState<string[]>([""]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [order, setOrder] = useState<number | -1 | 1>(-1);
  const [page, setPage] = useState<number>(1);
  const [haveMorePage, setHaveMorePage] = useState<boolean>(true);
  const t = useTranslations();

  const fetchComments = async () => {
    const { error, data }: IRespData<IPaginationData<IComment>> =
      await getCommentsOf({
        page,
        postId,
        order,
        ...(commentId && { respond: commentId }),
      });
    if (error) {
      setErrors(error);
      return;
    }
    if (!data) return alert("No se suponde que debas de ver esto");
    setHaveMorePage(data.hasNextPage);
    setComments(page == 1 ? data.docs : comments.concat(data.docs));
  };

  useEffect(() => {
    fetchComments();
  }, [page, order]);
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

  if (!comments)
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
      <div className={`py-2 pl-3 pr-3 ${commentId && "ml-14 pr-1"}`}>
        <div className={`${commentId && "hidden"} flex -space-x-px`}>
          <Button
            onClick={() => {
              setOrder(-1);
            }}
            variant="outline"
            className="rounded-r-none focus:z-10"
          >
            {t("user.posts.new")}
          </Button>
          <Button
            onClick={() => {
              setOrder(1);
            }}
            variant="outline"
            className="rounded-l-none focus:z-10"
          >
            {t("user.posts.old")}
          </Button>
        </div>
        {comments.length <= 0 && (
          <NoMoreComponent message={t("comments.noMoreComments")} />
        )}
        <div>
          {comments?.map((comment, index) => (
            <CommentItem
              t={t}
              key={index}
              comment={comment}
              postId={postId}
              setVisibleSubComments={setVisibleSubComments}
              throttledOnclick={throttledOnclick}
              visibleSubComments={visibleSubComments}
            />
          ))}
          {haveMorePage && (
            <Button
              onClick={() => {
                setPage((actual) => actual + 1);
              }}
              variant={"link"}
            >
              {t("showMore")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const CommentItem = ({
  comment,
  throttledOnclick,
  visibleSubComments,
  setVisibleSubComments,
  postId,
  t,
}: {
  comment: IComment;
  throttledOnclick: DebouncedFuncLeading<(commentId: string) => void>;
  visibleSubComments: string[];
  setVisibleSubComments: Dispatch<SetStateAction<string[]>>;
  postId: string;
  t: (string) => string;
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
          {format(comment.createdAt, "medium", t("locale"))}
          {comment.createdAt != comment.updatedAt &&
            ` - ${t("comments.edited")}`}
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
          className="rounded-r-none focus:z-10"
        >
          <Heart
            className={`mr-2 h-4 w-4 ${comment.like ? "fill-current" : ""}`}
          />
          {comment.likeCount}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-none focus:z-10"
          onClick={() =>
            !visibleSubComments.some((comm) => comm == comment._id)
              ? setVisibleSubComments((actual) => [...actual, comment._id])
              : setVisibleSubComments((actual) =>
                  actual.filter((commentId) => commentId != comment._id)
                )
          }
        >
          {visibleSubComments.some((comm) => comm == comment._id)
            ? t("comments.hidden")
            : t("comments.show")}
        </Button>

        <ModalCreateComment
          respondTo={comment.user.username}
          commentId={comment._id}
          postId={postId}
        />
      </div>
    </CardFooter>
    {visibleSubComments.some((comm) => comm == comment._id) && (
      <Comments commentId={comment._id} postId={postId} />
    )}
  </Card>
);

export default Comments;
