"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/interfaces/user.interface";
import { Edit } from "lucide-react";
import EditFieldModal from "./EditFieldModal";

export function EditUserForm({ user }: { user: IUser }) {
  const [avatarSrc, setAvatarSrc] = useState("/placeholder.svg");
  // TODO: cambiar la imagen
  // TODO: eliminar modal, crear las vaalidaciones, validar que si la contraseña esta incluida se pida validacion
  // siempre y cuando el valor inicial no sea null
  const onSubmit = () => {};

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {};
  // TODO: validationPass
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-center gap-5 ">
      <EditFieldModal
        isOpen={isModalOpen}
        changeOpen={() => setIsModalOpen((actual) => !actual)}
        field=""
      />
      <form onSubmit={onSubmit} className="space-y-8 w-full">
        <div>
          <Label htmlFor="image">Imagen de perfil</Label>
          <div className="flex items-center space-x-4 mt-2">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatarSrc} alt="Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Sube una imagen para tu perfil.
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-center border-2 rounded-md p-3 my-2">
            <div>
              <h3 className="pb-3 py-2 font-semibold text-lg"> Username</h3>
              {user.username}
            </div>
            <Button type="button" onClick={() => {}}>
              <Edit />
            </Button>
          </div>
          <div className="flex justify-between items-center border-2 rounded-md p-3 my-2">
            <div>
              <h3 className="pb-3 py-2 font-semibold text-lg"> Nombre</h3>
              {user.name}
            </div>
            <Button type="button" onClick={() => {}}>
              <Edit />
            </Button>
          </div>
          <div className="flex justify-between items-center border-2 rounded-md p-3 my-2">
            <div>
              <h3 className="pb-3 py-2 font-semibold text-lg"> Contraseña</h3>
              {user.pass}
            </div>
            <Button type="button" onClick={() => {}}>
              <Edit />
            </Button>
          </div>
          <div className="flex justify-between items-center border-2 rounded-md p-3 my-2">
            <div>
              <h3 className="pb-3 py-2 font-semibold text-lg"> Descripcion</h3>
              {user.description}
            </div>
            <Button type="button" onClick={() => {}}>
              <Edit />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
