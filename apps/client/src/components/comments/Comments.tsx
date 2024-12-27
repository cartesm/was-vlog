"use client";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { ThumbsUp } from "lucide-react";
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
const SubComments = dynamic(() => import("@/components/comments/SubComment"), {
  loading: () => <Skeleton />,
});

function Comments({ postId }: { postId: string }) {
  const { errors, set: setError, removeAll } = useFetchErrors();
  const [isLiked, setIsLiked] = useState<{ id: string; count: number }[]>([]);
  const [visibleSubComments, setVisibleSubComments] = useState<string[]>([""]);
  const [comments, setComments] = useState<IPaginationData<IComment> | null>(
    null
  );

  const fetchComments = async () => {
    const { error, data }: IRespData<IPaginationData<IComment>> =
      await getCommentsOf({
        page: 1,
        postId,
        order: 1,
      });
    if (error) {
      setError(error);
      return;
    }
    setComments(data ? data : null);
    data?.docs.forEach(
      (comment) =>
        comment.like &&
        setIsLiked((actual) => [
          ...actual,
          { count: comment.likeCount, id: comment._id },
        ])
    );
  };
  useEffect(() => {
    fetchComments();
  }, []);
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
      // psot- comment
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
      setIsLiked((actual) => [...actual, { id: postId, count: 2 }]);
      return;
    }
    setIsLiked((actual) => actual.filter((like) => like.id != commentId));
  };
  const throttledOnclick: DebouncedFuncLeading<(commentId: string) => void> =
    useCallback(
      throttle((commentId: string) => handleLike(commentId), 1500, {
        trailing: false,
      }),
      []
    );

  if (!comments || comments.docs.length <= 0)
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
      <h3 className="font-semibold text-2xl">Comentarios</h3>
      <div className="py-4">
        {comments.docs.map((comment) => (
          <div className="py-4 my-4 pl-6 border-l-2 flex" key={comment._id}>
            <Link href={`/user/${comment.user.username}`}>
              <Avatar>
                <AvatarImage
                  src={comment.user.img}
                  alt={comment.user.username}
                />
                <AvatarFallback>{comment.user.username}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="pl-4 flex items-start gap-1 flex-col">
              <span className="text-sm">
                {new Date(comment.createdAt).toLocaleDateString()}
                {comment.updatedAt != comment.createdAt && " (Editado)"}
              </span>
              <p>{comment.content}</p>
              <div className="flex gap-2 items-center">
                <Badge
                  onClick={() => throttledOnclick(comment._id)}
                  variant={"secondary"}
                  className={`flex gap-2 text-[15px] items-center justify-center cursor-pointer hover:bg-neutral-300 ${isLiked.some((like) => like.id == comment._id) && "bg-neutral-300 hover:bg-neutral-400"}`}
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
                      setVisibleSubComments((actual) => [
                        ...actual,
                        comment._id,
                      ])
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
        ))}
      </div>
    </div>
  );
}

export default Comments;
