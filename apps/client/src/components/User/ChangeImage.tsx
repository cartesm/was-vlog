"use client";
import { Spinner } from "../ui/spiner";
import Compressor from "compressorjs";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { updateProfileImage } from "@/lib/api/user";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function ChangeImage({
  userImage,
  username,
}: {
  username: string;
  userImage: string;
}) {
  const [img, setImg] = useState<null | File>(null);
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
  return (
    <form onSubmit={onSubmitImage} encType="multipart/form-data">
      <div>
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-1/3">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage
                    src={img ? URL.createObjectURL(img) : userImage}
                    alt={username}
                  />
                  <AvatarFallback>{username}</AvatarFallback>
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
  );
}

export default ChangeImage;
