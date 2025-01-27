"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IUpdateUser, IUser } from "@/interfaces/user.interface";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { updateUser } from "@/lib/api/user";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { useTranslations } from "next-intl";
import { passwordPattern } from "@/lib/utils/regex";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import ChangeImage from "./ChangeImage";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export default function EditUserForm({ user }: { user: IUser }) {
  const t = useTranslations();
  const [thisUser, setThisUser] = useState<IUpdateUser>({
    ...user,
    password: "",
    ...(!user.description && { description: "" }),
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { errors: fetchErrors, removeAll, set: setError } = useFetchErrors();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const validationOnSubmit = (data) => {
    console.log("sdsds");
    if (user.pass && data.password && !watch("validationPass")) {
      setModalOpen(true);
      console.log("waza");
      return;
    }
    console.log("paso");
    onSubmit(data);
  };

  const onSubmit = async (data: IUpdateUser) => {
    console.log("nose que paas");
    setModalOpen(false);
    removeAll();
    const fieldsToCheck = [
      "password",
      "description",
      "name",
      "username",
    ] as const;
    const anyChange = fieldsToCheck.some(
      (field) => data[field] !== thisUser[field]
    );
    if (!anyChange) {
      setError([t("user.notModified")]);
      return;
    }
    const { data: respData, error }: IRespData<string> = await updateUser(
      Object.fromEntries(
        Object.entries(data).filter(
          ([key, value]) => value != undefined && value != null && value != ""
        )
      )
    );
    reset({ validationPass: undefined });
    if (error) {
      setError(error);
      return;
    }
    setThisUser(data);
    reset({ password: undefined });
    toast({ title: t("status"), description: respData });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<IUpdateUser>({
    defaultValues: {
      name: user.name,
      username: user.username,
      ...(user.description && { description: user.description }),
    },
  });

  return (
    <div className="w-full mx-auto">
      <ChangeImage userImage={user.img} username={user.username} />
      <Dialog
        open={modalOpen}
        onOpenChange={() => setModalOpen((actual) => !actual)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("auth.validationPass")}</DialogTitle>
            <DialogDescription>{t("user.descriptions.pass")}</DialogDescription>
            <DialogContent>
              <span>{t("auth.passValidation")}</span>
              <div>
                <Label htmlFor="validationPass">
                  {t("auth.validationPass")}
                </Label>
                <div className="relative w-full ">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    className="mt-2"
                    {...register("validationPass", {
                      required: modalOpen,
                    })}
                    form="formData"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((actual) => !actual)}
                    aria-label={
                      showPassword ? t("password.hide") : t("password.show")
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                <div className="flex flex-col">
                  {errors.validationPass?.type == "required" && (
                    <span className="error-message">
                      {t("auth.auth.passEmpty")}
                    </span>
                  )}
                </div>
                <Button className="my-3 " type="submit" form="formData">
                  {t("password.validate")}
                </Button>
              </div>
            </DialogContent>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/*  */}
      <form
        onSubmit={handleSubmit(validationOnSubmit, (ee) => console.log(ee))}
        id="formData"
        className="space-y-8 w-full"
      >
        <div className="flex flex-col">
          {fetchErrors?.map((err, index) => (
            <span key={index} className="error-message">
              {err}
            </span>
          ))}
        </div>
        <div>
          <Label htmlFor="name">{t("auth.name")}</Label>
          <Input
            id="name"
            placeholder={t("auth.placeholder.name")}
            className="mt-2"
            {...register("name", {
              minLength: 6,
              maxLength: 60,
            })}
          />
          <p className="text-sm text-gray-500 mt-2">
            {t("user.descriptions.name")}
          </p>
          <div className="flex flex-col">
            {errors.name?.type == "required" && (
              <span className="error-message">{t("auth.auth.nameEmpty")}</span>
            )}
            {errors.name?.type == "minLength" && (
              <span className="error-message">{t("auth.auth.nameMin")}</span>
            )}
            {errors.name?.type == "maxLength" && (
              <span className="error-message">{t("auth.auth.nameMax")}</span>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="username">{t("auth.username")}</Label>
          <Input
            id="username"
            {...register("username", {
              minLength: 5,
              maxLength: 27,
            })}
            placeholder={t("auth.placeholder.username")}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            {t("user.descriptions.username")}
          </p>
          <div className="flex flex-col">
            {errors.username?.type == "required" && (
              <span className="error-message">
                {t("auth.auth.usernameEmpty")}
              </span>
            )}
            {errors.username?.type == "minLength" && (
              <span className="error-message">
                {t("auth.auth.usernameMin")}
              </span>
            )}
            {errors.username?.type == "maxLength" && (
              <span className="error-message">
                {t("auth.auth.usernameMax")}
              </span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="description">{t("auth.description")}</Label>
          <div className="w-full  relative">
            <Textarea
              className="w-full"
              {...register("description", {
                minLength: 10,
                maxLength: 150,
                required: false,
              })}
              placeholder={t("auth.placeholder.description")}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500 bg-white px-1 rounded">
              <span>{(watch("description") as string)?.length}</span>
              <span>/150</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {t("user.descriptions.description")}
          </p>
          <div className="flex flex-col">
            {errors.description?.type == "minLength" && (
              <span className="error-message">
                {t("auth.auth.descriptionMinLength")}
              </span>
            )}
            {errors.description?.type == "maxLength" && (
              <span className="error-message">
                {t("auth.auth.descriptionMaxLength")}
              </span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="password">{t("auth.pass")}</Label>
          <div className="relative w-full ">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className="mt-2"
              {...register("password", {
                minLength: 6,
                pattern: passwordPattern,
              })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((actual) => !actual)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {t("user.descriptions.pass")}
          </p>
          <div className="flex flex-col">
            {errors.password?.type == "required" && (
              <span className="error-message">{t("auth.auth.passEmpty")}</span>
            )}
            {errors.password?.type == "minLength" && (
              <span className="error-message">{t("auth.auth.passMin")}</span>
            )}
            {errors.password?.type == "pattern" && (
              <span className="error-message">
                {t("auth.auth.passValidation")}
              </span>
            )}
          </div>
        </div>
        <Button type="submit" variant={"default"}>
          {t("update")}
        </Button>
      </form>
    </div>
  );
}
