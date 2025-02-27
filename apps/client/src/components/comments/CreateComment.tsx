"use client";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { IAuthData } from "@/interfaces/authData.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { createComment } from "@/lib/api/posts/comments";
import { useCallback } from "react";
import { DebouncedFuncLeading, throttle } from "lodash";
import { useTranslations } from "next-intl";

interface ICreateComment {
  content: string;
}

function CreateComment({
  user,
  postId,
}: {
  user: IAuthData | null;
  postId: string;
}) {
  const t = useTranslations();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ICreateComment>();

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

    const { error, data: respData }: IRespData<string> = await createComment({
      content: data.content,
      post: postId,
    });

    if (error) {
      toast({
        title: t("comments.error"),
        description: error[0],
        variant: "destructive",
      });
      return;
    }
    toast({ title: t("comments.success"), description: respData });
    reset();
  };

  const throttledOnclick: DebouncedFuncLeading<(data: ICreateComment) => void> =
    useCallback(throttle(onSubmit, 2000), []);

  return (
    <div>
      <form onSubmit={handleSubmit((data) => throttledOnclick(data))}>
        <div className="flex flex-col  items-center justify-between gap-2 p-2">
          <div className="flex gap-3 items-center justify-start w-full">
            <Avatar>
              <AvatarImage
                src={
                  user?.img ??
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt={user?.username ?? t("user.profileImage")}
              />
              <AvatarFallback>
                {user?.username ?? t("auth.username")}
              </AvatarFallback>
            </Avatar>
            <Label>{t("comments.write")}</Label>
          </div>
          <Textarea
            {...register("content", {
              minLength: 4,
              required: true,
              maxLength: 400,
            })}
            placeholder={t("comments.placeholder")}
            className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
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
    </div>
  );
}

export default CreateComment;
