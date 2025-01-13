"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUpdateUser, IUser } from "@/interfaces/user.interface";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { updateProfileImage, updateUser } from "@/lib/api/user";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { useTranslations } from "next-intl";
import { passwordPattern } from "@/lib/utils/regex";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "../ui/spiner";
import Compressor from "compressorjs";
import { Card, CardContent } from "../ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

export function EditUserForm({ user }: { user: IUser }) {
  const t = useTranslations();
  const [thisUser, setThisUser] = useState<IUpdateUser>({
    ...user,
    password: "",
    ...(!user.description && { description: "" }),
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [img, setImg] = useState<null | File>(null);
  const { errors: fetchErrors, removeAll, set: setError } = useFetchErrors();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const onSubmitImage = (e) => {
    e.preventDefault();
    if (!img)
      return toast({
        title: "Error",
        description: "selecciona una imagen",
        variant: "destructive",
      });
    setIsLoading(true);
    new Compressor(img, {
      quality: 0.6,
      async success(result) {
        const formData: FormData = new FormData();
        formData.append("img", result);

        const {
          data: respData,
          error: respError,
        }: IRespData<{ data: string; message: string }> =
          await updateProfileImage(formData);
        setIsLoading(false);
        if (respError) {
          e.target.value = "";
          return toast({
            title: "Error",
            description: respError,
            variant: "destructive",
          });
        }

        toast({
          title: "image uploiad",
          description: respData?.message,
        });
      },
      error(error) {
        setIsLoading(false);
        console.error(error);
        toast({
          title: "Error",
          description: "error al subir la imagen",
          variant: "destructive",
        });
      },
    });
  };

  const onSubmit = async (data: IUpdateUser) => {
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
    console.log(data.password);
    console.log(thisUser.password);

    if (!anyChange) {
      setError(["Primero modifica algo"]);
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
    toast({ title: "Estado", description: respData });
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
      <form onSubmit={onSubmitImage} encType="multipart/form-data">
        <div>
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="w-full sm:w-1/3">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage
                      src={img ? URL.createObjectURL(img) : user.img}
                      alt={user.username}
                    />
                    <AvatarFallback>{user.username}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="w-full sm:w-2/3 space-y-2">
                  <Input
                    className="cursor-pointer"
                    id="image"
                    type="file"
                    accept=".jpg , .png , .jpge "
                    onChange={(e) => {
                      setImg(e.target.files ? e.target.files[0] : null);
                    }}
                  />
                  {isLoading && <Spinner size={"medium"} />}
                </div>
              </div>
            </CardContent>
          </Card>
          <p className="text-sm text-gray-500 mt-2">
            Sube una imagen para tu perfil.
          </p>
          <Button className="max-h-8 my-3">Cambiar</Button>
        </div>
      </form>
      {/* data */}
      <Dialog
        open={modalOpen}
        onOpenChange={() => setModalOpen((actual) => !actual)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogContent>
              <span>Ingresa una nueva contraseña si deseas cambiarla.</span>
              <div>
                <Label htmlFor="validationPass">Contraseña de validacion</Label>
                <div className="relative w-full ">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="validationPass"
                    placeholder="********"
                    className="mt-2"
                    {...register("validationPass", {
                      minLength: 6,
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
                <div className="flex flex-col">
                  {errors.validationPass?.type == "required" && (
                    <span className="error-message">
                      {t("auth.auth.passEmpty")}
                    </span>
                  )}
                  {errors.validationPass?.type == "minLength" && (
                    <span className="error-message">min 6</span>
                  )}
                </div>
                <Button className="my-3 " type="submit" form="formData">
                  Validar
                </Button>
              </div>
            </DialogContent>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <form
        onSubmit={handleSubmit((data: IUpdateUser) => {
          if (user.pass && data.password && !watch("validationPass")) {
            setModalOpen(true);
            return;
          }
          onSubmit(data);
        })}
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
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            placeholder="Tu nombre completo"
            className="mt-2"
            {...register("name", {
              minLength: 6,
              maxLength: 60,
            })}
          />
          <p className="text-sm text-gray-500 mt-2">
            Este es tu nombre público.
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
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            {...register("username", {
              minLength: 5,
              maxLength: 27,
            })}
            placeholder="tunombredeusuario"
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            Este es tu identificador único en la plataforma.
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
          <Label htmlFor="description">Descripción</Label>
          <div className="w-full  relative">
            <Textarea
              className="w-full"
              {...register("description", {
                minLength: 10,
                maxLength: 150,
                required: false,
              })}
            />
            <div
              className="absolute bottom-2 right-2 text-sm text-gray-500 bg-white px-1 rounded"
              aria-live="polite"
              aria-atomic="true"
            >
              <span>{(watch("description") as string)?.length}</span>
              <span>/150</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Una breve descripción sobre ti.{" "}
          </p>
          <div className="flex flex-col">
            {errors.description?.type == "minLength" && (
              <span className="error-message">
                La descripción debe ser de minimo 10
              </span>
            )}
            {errors.description?.type == "maxLength" && (
              <span className="error-message">
                La descripción debe ser de maximo 150
              </span>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative w-full ">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
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
            Ingresa una nueva contraseña si deseas cambiarla.
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

        <Button type="submit">Guardar cambios</Button>
      </form>
    </div>
  );
}
