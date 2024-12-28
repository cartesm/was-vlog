"use client";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { IAuthData } from "@/interfaces/authData.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ICreateComment {
  content: string;
}

function CreateComment({ user }: { user: IAuthData | null }) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ICreateComment>();

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
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            {/* //TODO: terminar de crear comentarios- hacer el lookup para que muestre las imagenes del usuario  */}
            {/* //TODO: mojorar el validate para que actualize img */}
            <Label>Escribe un comentario</Label>
          </div>
          <Textarea
            {...register("content", {
              minLength: 4,
              required: true,
              maxLength: 400,
            })}
            className="ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
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
    </div>
  );
}

export default CreateComment;
