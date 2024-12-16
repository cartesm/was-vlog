"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "../ui/input";
import { Plus, Save, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useFormContext } from "react-hook-form";
import { useTotalWrite } from "@/hooks/useTotalWrite";
import { IData } from "./Write";
import dynamic from "next/dynamic";
const UpdateName = dynamic(() => import("@/components/Posts/UpdateName"), {
  ssr: false,
});
const SearchTags = dynamic(() => import("@/components/Write/SearchTags"), {
  ssr: false,
});
export default function CompactSection() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tagsVisible, setTagsVisible] = useState<boolean>(false);
  const changeTagsOpen = () => setTagsVisible((actual) => !actual);
  const changeOpen = () => setIsOpen((actual) => !actual);
  const {
    register,
    formState: { errors },
  } = useFormContext<IData>();

  const { tags, deleteTag, submitErrors, id: nameId } = useTotalWrite();

  return (
    <div className="bg-background p-4 my-4 rounded-lg ">
      {isOpen && <UpdateName changeOpen={changeOpen} open={isOpen} />}
      <div className="flex items-center justify-between">
        <div
          className={` mr-2 mb-2 flex ${!!nameId && "rounded-md bg-secondary "} `}
        >
          <Input
            form="write-form"
            placeholder="TITULO"
            autoFocus
            {...register("name", {
              required: true,
              minLength: 10,
              maxLength: 150,
            })}
            readOnly={!!nameId}
            className={`text-xl px-3 py-2 font-bold   ${!!nameId && "rounded-md bg-secondary "}  outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0`}
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                form="write-form"
                type="submit"
                variant="secondary"
                size="sm"
                className="w-[100px]"
              >
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
            onClick={() => deleteTag(tag._id)}
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
        {tagsVisible && (
          <SearchTags changeOpen={changeTagsOpen} isOpen={tagsVisible} />
        )}
        <Button
          onClick={() => setTagsVisible(true)}
          variant="outline"
          size="sm"
        >
          <Plus />
        </Button>
      </div>
      <Textarea
        {...register("description", {
          required: true,
          minLength: 10,
          maxLength: 200,
        })}
        form="write-form"
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
        {submitErrors &&
          submitErrors.map((error, index) => (
            <span className="error-message" key={index}>
              {error}
            </span>
          ))}
      </div>
    </div>
  );
}
