"use client";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { createComment } from "@/lib/api/posts/comments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DebouncedFuncLeading, throttle } from "lodash";
import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";

interface ICreateComment {
  content: string;
}

function ModalCreateComment({
  postId,
  commentId,
  respondTo,
}: {
  postId: string;
  commentId: string;
  respondTo: string;
}) {
  const t = useTranslations();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ICreateComment>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onSubmit: SubmitHandler<ICreateComment> = async (
    data: ICreateComment
  ) => {
    const cookies = (await import("js-cookie")).default;
    const token: string | undefined = cookies.get("was_auth_token");
    if (!token)
      return toast({
        title: t("auth.loginRequired"),
        description: t("comments.auth"),
        variant: "destructive",
      });

    const { error }: IRespData<string> = await createComment({
      content: data.content,
      post: postId,
      respondTo: commentId,
    });

    if (error) {
      toast({
        title: t("comments.error"),
        description: error[0],
        variant: "destructive",
      });
      return;
    }
    setIsOpen(false);
  };
  const throttledOnclick: DebouncedFuncLeading<(data: ICreateComment) => void> =
    useCallback(throttle(onSubmit, 2000), []);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen((actual) => !actual)}>
        <DialogTrigger>
          <Button
            variant="outline"
            size={"sm"}
            className="rounded-l-none focus:z-10"
          >
            {t("comments.respond")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span className="font-semibold">
                {t("comments.respondTo")}:{respondTo}{" "}
              </span>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => throttledOnclick(data))}>
            <div className="flex flex-col  items-center justify-between gap-2 p-2">
              <div className="flex gap-3 items-center justify-start w-full">
                <Label>{t("comments.write")}</Label>
              </div>
              <Textarea
                {...register("content", {
                  minLength: 4,
                  required: true,
                  maxLength: 400,
                })}
                className="ring-0 border-2 focus-visible:ring-offset-0 focus-visible:ring-0"
              />
              <Button type="submit" variant={"default"} className="max-h-8 ">
                {t("comments.comment")}
              </Button>
            </div>
          </form>
          <div className="flex items-center flex-col gap-2 justify-center">
            {errors.content?.type == "required" && (
              <span className="error-message">
                {t("comments.validation.required")}
              </span>
            )}
            {errors.content?.type == "minLength" && (
              <span className="error-message">
                {t("comments.validation.minLength")}
              </span>
            )}
            {errors.content?.type == "maxLength" && (
              <span className="error-message">
                {t("comments.validation.maxLength")}
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ModalCreateComment;
