"use client";

import { useFetchErrors } from "@/hooks/useFetchErrors";
import {
  Comment,
  getCommentsOf,
  IGetComments,
  PaginationData,
} from "@/lib/api/posts/comments";
import { FileX2, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

export default function SubComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}) {
  const { errors, set: setError } = useFetchErrors();
  const [comments, setComments] = useState<PaginationData<Comment> | null>(
    null
  );
  const fetchComments = async () => {
    const resp: IGetComments<PaginationData<Comment>> = await getCommentsOf({
      page: 1,
      postId,
      order: 1,
      respond: commentId,
    });

    if (resp.error) {
      setError(resp.error);
      return;
    }
    setComments(resp.data ? resp.data : null);
  };
  useEffect(() => {
    fetchComments();
  }, []);

  if (!comments || comments.docs.length <= 0)
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
    <div>
      <div className="pb-4">
        <span>sdsd</span>
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
                  variant={"secondary"}
                  className="flex gap-2 text-[15px] items-center justify-center cursor-pointer hover:bg-neutral-300"
                >
                  <ThumbsUp size={15} /> {comment.likeCount}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
