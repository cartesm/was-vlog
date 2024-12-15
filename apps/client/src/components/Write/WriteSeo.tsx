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
import { useFormContext } from "react-hook-form";
import { useWrite } from "@/hooks/useWrite";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTotalWrite } from "@/hooks/useTotalWrite";
import { IData } from "./Write";
import UpdateName from "../Posts/UpdateName";
export default function CompactSection() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUpdateOpen, setIsupdateOpen] = useState<boolean>(false);

  const { text, index } = useWrite();
  const changeOpen = () => setIsOpen(!isOpen);
  const changeUpdateOpen = () => setIsupdateOpen(!isUpdateOpen);
  const {
    register,
    formState: { errors },
  } = useFormContext<IData>();

  const {
    name,
    setName,
    description,
    setDescription,
    tags,
    deleteTag,
    submitErrors,
    id: nameId,
  } = useTotalWrite();

  return (
    <div className="bg-background p-4 my-4 rounded-lg ">
      <SearchTags isOpen={isOpen} changeOpen={changeOpen} />
      <div className="flex items-center justify-between">
        <div
          className={` mr-2 mb-2 flex   ${!!nameId && "rounded-md bg-secondary "} `}
        >
          <Input
            form="write-form"
            placeholder="TITULO"
            autoFocus
            value={name}
            {...register("name", {
              required: true,
              minLength: 10,
              maxLength: 150,
            })}
            readOnly={!!nameId}
            onChange={(e) => setName(e.target.value)}
            className={`text-xl px-3 py-2 font-bold   ${!!nameId && "rounded-md bg-secondary "}  outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0`}
          />
          <UpdateName open={isUpdateOpen} changeOpen={changeUpdateOpen} />
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
        form="write-form"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
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
