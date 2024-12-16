"use client";
import { UpdateIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useTotalWrite } from "@/hooks/useTotalWrite";
import { Input } from "../ui/input";
import { SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { IResponseCreate, updatePost } from "@/lib/api/posts";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { Spinner } from "../ui/spiner";
import { IData } from "@/interfaces/IWriteData.interface";
interface Inputs {
  name: string;
}

function UpdateName({
  open,
  changeOpen,
  id,
}: {
  open: boolean;
  changeOpen: () => void;
  id: string;
}) {
  const { setErrors, submitErrors } = useTotalWrite();

  const { reset } = useFormContext<IData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const { error, message }: IResponseCreate = await updatePost(
      { name: data.name.trimEnd() },
      id
    );
    setLoading(false);
    if (error) {
      setErrors(message);
      const timeErrors = setTimeout(() => {
        setErrors([]);
        return clearTimeout(timeErrors);
      }, 3000);
      return;
    }
    router.replace(`/write/${data.name}`);
    reset({ name: data.name });
    changeOpen();
  };

  return (
    <Dialog onOpenChange={changeOpen} open={open}>
      <DialogTrigger>
        <Button
          type="button"
          className={`${!!id ? "block" : "hidden"} `}
          variant={"secondary"}
          size={"icon"}
        >
          <UpdateIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Actualizar nombre</DialogTitle>
          <DialogDescription>
            El nombre se actualiza aparte del contenido por la logica que
            conlleva detras. Asegurate de escoger un nombre que no este en uso
          </DialogDescription>
        </DialogHeader>
        <div>
          <form id="update-name-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <Input
                {...register("name", {
                  required: true,
                  minLength: 10,
                  maxLength: 150,
                })}
                defaultValue={id}
                type="text"
                autoComplete="off"
              />
              <Button variant={"default"} type="submit" form="update-name-form">
                Actualizar
              </Button>
              <div className="flex items-center justify-center mx-auto">
                {loading && <Spinner size={"small"} />}
              </div>
              <div className="flex flex-col gap-2 items-center justify-center mx-auto">
                {errors.name?.type == "required" && (
                  <span className="error-message">El titulo es requerido</span>
                )}
                {errors.name?.type == "minLength" && (
                  <span className="error-message">
                    El titulo es de minimo 10 caracteres
                  </span>
                )}
                {errors.name?.type == "maxLength" && (
                  <span className="error-message">
                    El titulo es de maximo 150 caracteres
                  </span>
                )}
                {submitErrors?.map((err, index) => (
                  <span key={index} className="error-message">
                    {err}
                  </span>
                ))}
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateName;
