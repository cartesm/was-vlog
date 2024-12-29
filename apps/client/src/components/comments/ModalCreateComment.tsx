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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DebouncedFuncLeading, throttle } from "lodash";
import { useCallback, useState } from "react";

interface ICreateComment {
  content: string;
}

function ModalCreateComment({
  user,
  postId,
  commentId,
}: {
  user?: IAuthData | null;
  postId: string;
  commentId: string;
}) {
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
        title: "Inicio de sesion",
        description: "Inicia sesion para poder agregar un comentario",
        variant: "destructive",
      });

    const { error }: IRespData<string> = await createComment({
      content: data.content,
      post: postId,
      respondTo: commentId,
    });

    if (error) {
      toast({
        title: "Error al comentar",
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
            Responder
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respondiendo a : </DialogTitle>
            {/* <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription> */}
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => throttledOnclick(data))}>
            <div className="flex flex-col  items-center justify-between gap-2 p-2">
              <div className="flex gap-3 items-center justify-start w-full">
                <Avatar>
                  <AvatarImage
                    src={
                      user?.img ??
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                    alt={user?.username ?? "user avatar"}
                  />
                  <AvatarFallback>{user?.username ?? "User"}</AvatarFallback>
                </Avatar>
                <Label>Escribe un comentario</Label>
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
                Comentar
              </Button>
            </div>
          </form>
          <div className="flex items-center flex-col gap-2 justify-center">
            {errors.content?.type == "required" && (
              <span className="error-message">escribe algo primero</span>
            )}
            {errors.content?.type == "minLength" && (
              <span className="error-message">
                El conenido minimo es de 4 caracter
              </span>
            )}
            {errors.content?.type == "maxLength" && (
              <span className="error-message">
                El conenido maximo es de 400 caracter
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ModalCreateComment;
