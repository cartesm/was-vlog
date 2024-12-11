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
import { SubmitHandler, useForm } from "react-hook-form";
import { useWrite } from "@/hooks/useWrite";

interface IData {
  title: string;
  description: string;
}

export default function CompactSection() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { text, index } = useWrite();
  const changeOpen = () => setIsOpen(!isOpen);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IData>();
  const onSubmit: SubmitHandler<IData> = (data) => {
    console.log(data);
  };

  return (
    <div className="bg-background p-4 my-4 rounded-lg ">
      <SearchTags
        isOpen={isOpen}
        changeOpen={changeOpen}
        setTags={setTags}
        tags={tags}
      />
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between">
          <Input
            value={title}
            placeholder="TITULO"
            autoFocus
            {...register("title", {
              required: true,
              minLength: 10,
              maxLength: 150,
            })}
            className="text-xl  px-3 py-2 font-bold outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            onChange={(e) => setTitle(e.target.value)}
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
          {errors.title?.type == "required" && (
            <span className="error-message">El titulo es requerido</span>
          )}
          {errors.title?.type == "minLength" && (
            <span className="error-message">
              El titulo es de minimo 10 caracteres{" "}
            </span>
          )}
          {errors.title?.type == "maxLength" && (
            <span className="error-message">
              El titulo es de maximo 150 caracteres
            </span>
          )}
          {errors.description?.type == "required" && (
            <span className="error-message">
              La descripcion es de maximo 150 caracteres
            </span>
          )}
          {errors.description?.type == "minLength" && (
            <span className="error-message">
              La descripcion es de minimo 10 caracteres{" "}
            </span>
          )}
          {errors.description?.type == "maxLength" && (
            <span className="error-message">
              La descripcion es de maximo 200 caracteres
            </span>
          )}
          {!text[index] && (
            <span className="error-message">
              El contenido del post no puede estar vacio
            </span>
          )}
          {text[index].length < 200 && (
            <span className="error-message">
              El contenido del post debe ser de minimo 200 caracteres
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
