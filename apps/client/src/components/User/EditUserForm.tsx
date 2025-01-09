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
import { AspectRatio } from "../ui/aspect-ratio";
import { Card, CardContent } from "../ui/card";

export function EditUserForm({ user }: { user: IUser }) {
  const t = useTranslations();
  const [img, setImg] = useState<null | File>(null);
  const { errors: fetchErrors, removeAll, set: setError } = useFetchErrors();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    removeAll();
    const anyChange: boolean =
      data.password != user.pass ||
      data.description != user.description ||
      data.name != user.name ||
      data.username != user.username;
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
    if (error) {
      setError(error);
      return;
    }
    toast({ title: "Estado", description: respData });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdateUser>({
    defaultValues: {
      name: user.name,
      username: user.username,
      ...(user.description && { description: user.description }),
      ...(user.pass && { pass: user.pass }),
    },
  });
  // TODO: validar la contraseña nueva y viueja

  return (
    <div className="w-full mx-auto">
      <form onSubmit={onSubmitImage} encType="multipart/form-data">
        <div>
          <Label htmlFor="image">Imagen de perfil</Label>
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
                    className="hover:cursor-pointer"
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
      <form
        onSubmit={handleSubmit((data: IUpdateUser) => {
          if (data.password && user.pass) {
            alert("ingresa contra");
            return;
          }
          onSubmit(data);
        })}
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
          <Textarea
            id="description"
            placeholder="Cuéntanos un poco sobre ti"
            className="mt-2 resize-none"
            {...register("description", {
              minLength: 10,
              maxLength: 150,
              required: false,
            })}
          />
          <p className="text-sm text-gray-500 mt-2">
            Una breve descripción sobre ti. Máximo 500 caracteres.
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
          <Input
            id="password"
            type="password"
            placeholder="********"
            className="mt-2"
            {...register("password", {
              minLength: 6,
              pattern: passwordPattern,
            })}
          />
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
