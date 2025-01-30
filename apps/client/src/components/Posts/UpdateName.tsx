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
import { Input } from "../ui/input";
import { SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { updatePost } from "@/lib/api/posts/posts";
import { useState } from "react";
import { Spinner } from "../ui/spiner";
import { IData } from "@/interfaces/IWriteData.interface";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { useTranslations } from "next-intl";
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
  const { reset } = useFormContext<IData>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const { errors: submitErrors, removeAll, set: setErrors } = useFetchErrors();
  const t = useTranslations();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const { error }: IRespData<string> = await updatePost(
      { name: data.name.trimEnd() },
      id
    );
    setLoading(false);
    if (error) {
      setErrors(error);
      const timeErrors = setTimeout(() => {
        removeAll();
        return clearTimeout(timeErrors);
      }, 3000);
      return;
    }
    window.history.pushState(null, `${data.name}`);
    reset({ name: data.name });
    changeOpen();
  };

  return (
    <Dialog onOpenChange={changeOpen} open={open}>
      <DialogTrigger>
        <Button
          type="button"
          className={`${!!id && id != "new" ? "block" : "hidden"} `}
          variant={"secondary"}
          size={"icon"}
        >
          <UpdateIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("posts.message2")}</DialogTitle>
          <DialogDescription>{t("posts.message1")}</DialogDescription>
        </DialogHeader>
        <div>
          <form id="update-name-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              <Input
                {...register("name", {
                  required: true,
                  minLength: 10,
                  maxLength: 150,
                  pattern: /^[a-zA-Z0-9\s]+$/,
                })}
                placeholder={t("posts.message3")}
                defaultValue={id.replaceAll("%20", " ")}
                type="text"
                autoComplete="off"
              />
              <Button variant={"default"} type="submit" form="update-name-form">
                {t("update")}
              </Button>
              <div className="flex items-center justify-center mx-auto">
                {loading && <Spinner size={"small"} />}
              </div>
              <div className="flex flex-col gap-2 items-center justify-center mx-auto">
                {errors.name?.type == "required" && (
                  <span className="error-message">
                    {t("posts.validations.requiredError")}
                  </span>
                )}
                {errors.name?.type == "minLength" && (
                  <span className="error-message">
                    {t("posts.validations.minLengthError")}
                  </span>
                )}
                {errors.name?.type == "pattern" && (
                  <span className="error-message">
                    {t("posts.validations.patternError")}
                  </span>
                )}
                {errors.name?.type == "maxLength" && (
                  <span className="error-message">
                    {t("posts.validations.maxLengthError")}
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
