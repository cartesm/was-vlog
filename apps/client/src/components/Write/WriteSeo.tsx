"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "../ui/input";
import { Plus, Save, Trash } from "lucide-react";
import SearchTags from "./SearchTags";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { useWrite } from "@/hooks/useWrite";
import {
  createPost,
  ICreatePost,
  IResponseCreate,
  updatePost,
} from "@/lib/api/posts";
import { useLocale } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface IData {
  name: string;
  description: string;
  content: string;
}

export default function CompactSection() {
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { text, index } = useWrite();
  const [errorsTocreate, setErrorsTocreate] = useState<string[]>([""]);
  const lang: string = useLocale();
  const changeOpen = () => setIsOpen(!isOpen);
  const [alreadyCreated, setAlreadyCreated] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<IData>();

  const onSubmit: SubmitHandler<IData> = async (data: IData) => {
    const createData: ICreatePost = {
      ...data,
      content: text[index],
      languaje: lang,
    };
    if (tags.length >= 1) {
      const parsedTags: { _id: string }[] = tags.map((actual) => ({
        _id: actual._id,
      }));
      createData.tags = parsedTags;
    }
    const resp: IResponseCreate = !alreadyCreated
      ? await createPost(createData)
      : await updatePost(createData, alreadyCreated);
    if (!resp.error) {
      toast({ title: "Exito", description: resp.message });
      setAlreadyCreated(createData.name);
      return;
    }
    setErrorsTocreate(resp.message);

    const timer = setTimeout(() => {
      setErrorsTocreate([""]);
      return clearTimeout(timer);
    }, 3000);
  };

  return (
    <div className="bg-background p-4 my-4 rounded-lg ">
      <SearchTags
        isOpen={isOpen}
        changeOpen={changeOpen}
        setTags={setTags}
        tags={tags}
      />
      <form
        id="formWrite"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex items-center justify-between">
          <Input
            placeholder="TITULO"
            autoFocus
            {...register("name", {
              required: true,
              minLength: 10,
              maxLength: 150,
            })}
            className="text-xl  px-3 py-2 font-bold outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="secondary" size="sm" className="w-[100px]">
                  <Save />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Guardar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              variant={"secondary"}
              className="flex items-center justify-evenly gap-2 "
              key={tag._id}
              onClick={() => {
                setTags((actual: { _id: string; name: string }[]) =>
                  actual.filter((dato) => dato._id != tag._id)
                );
              }}
            >
              {tag.name}
              <Button
                size={"sm"}
                variant={"link"}
                className="hover:bg-primary rounded-full hover:text-secondary "
              >
                <Trash size={15} />
              </Button>
            </Badge>
          ))}
          <Button onClick={() => setIsOpen(true)} variant="outline" size="sm">
            <Plus />
          </Button>
        </div>
        <Textarea
          {...register("description", {
            required: true,
            minLength: 10,
            maxLength: 200,
          })}
          placeholder="Descripción breve..."
          className="h-full  outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
        />
        <div className=" grid grid-cols-1 gap-3 items-center justify-start">
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
          {errors.description?.type == "maxLength" && (
            <span className="error-message">
              La descripcion es de maximo 150 caracteres
            </span>
          )}
          {errors.description?.type == "minLength" && (
            <span className="error-message">
              La descripcion es de minimo 10 caracteres
            </span>
          )}
          {errors.description?.type == "required" && (
            <span className="error-message">La descripcion no es opcional</span>
          )}
          {errors.content?.type == "required" && (
            <span className="error-message">
              El contenido no puede quedar vacio
            </span>
          )}
          {errors.content?.type == "minLength" && (
            <span className="error-message">
              El contenido debe tener un minimo de 200 caracteres
            </span>
          )}
        </div>
        <div className=" grid grid-cols-1 gap-3 items-center justify-start">
          {errorsTocreate.map((error, index) => (
            <span className="error-message" key={index}>
              {error}
            </span>
          ))}
        </div>
      </form>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Palabras: {text[index].split(/\s+/).filter(Boolean).length}</p>
          <p>Caracteres: {text[index].length}</p>
        </CardContent>
      </Card>
    </div>
  );
}
