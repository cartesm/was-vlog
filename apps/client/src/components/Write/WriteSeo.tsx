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
import dynamic from "next/dynamic";
import { IData } from "@/interfaces/IWriteData.interface";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { useWriteTags } from "@/hooks/write/useTags";
import SearchTags from "./SearchTags";
import { useTranslations } from "next-intl";
const UpdateName = dynamic(() => import("@/components/Posts/UpdateName"), {
  ssr: false,
});

export default function CompactSection({ nameId }: { nameId: string }) {
  const { errors: submitErrors } = useFetchErrors();
  const { delete: deleteTag, tags } = useWriteTags();

  const t = useTranslations();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tagsVisible, setTagsVisible] = useState<boolean>(false);

  const changeTagsOpen = () => setTagsVisible((actual) => !actual);
  const changeOpen = () => setIsOpen((actual) => !actual);
  const {
    register,
    formState: { errors },
  } = useFormContext<IData>();

  return (
    <div className="bg-background p-4 my-4 rounded-lg ">
      <div className="flex items-center justify-between">
        <div
          className={` mr-2 mb-2 flex ${!!nameId && nameId != "new" && "rounded-md bg-secondary "} `}
        >
          <Input
            form="write-form"
            placeholder={t("write.panel.title")}
            autoFocus
            {...register("name", {
              required: true,
              minLength: 10,
              maxLength: 150,
              pattern: /^[a-zA-Z0-9\s]+$/,
            })}
            readOnly={!!nameId && nameId != "new"}
            className={`text-xl px-3 py-2 font-bold   ${!!nameId && nameId != "new" && "rounded-md bg-secondary "}  outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0`}
          />
          <UpdateName
            id={nameId as string}
            changeOpen={changeOpen}
            open={isOpen}
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
              <p>{t("save")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <span className=" font-semibold text-primary pb-3 pl-2 block ">
        {t("tags.selectedTags")}
      </span>
      <div className="flex items-center flex-wrap gap-2">
        {tags?.map((tag) => (
          <Badge
            variant={"secondary"}
            className="flex items-center justify-evenly gap-2 "
            key={tag._id}
            onClick={() => deleteTag(tag._id)}
          >
            {tag?.name}
            <Button
              size={"sm"}
              variant={"link"}
              className="hover:bg-primary rounded-full hover:text-secondary "
            >
              <Trash size={15} />
            </Button>
          </Badge>
        ))}
        <SearchTags changeOpen={changeTagsOpen} isOpen={tagsVisible} />
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
        placeholder={t("write.panel.description")}
        className="h-full my-2  outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
        rows={7}
      />
      <div className=" grid grid-cols-1 gap-3 items-center justify-start">
        {errors.name?.type == "required" && (
          <span className="error-message">
            {t("write.panel.validations.titleRequired")}
          </span>
        )}
        {errors.name?.type == "pattern" && (
          <span className="error-message">
            {t("write.panel.validations.titlePattern")}
          </span>
        )}
        {errors.name?.type == "minLength" && (
          <span className="error-message">
            {t("write.panel.validations.titleMinLength")}
          </span>
        )}
        {errors.name?.type == "maxLength" && (
          <span className="error-message">
            {t("write.panel.validations.titleMaxLength")}
          </span>
        )}
        {errors.description?.type == "maxLength" && (
          <span className="error-message">
            {t("write.panel.validations.descriptionMaxLength")}
          </span>
        )}
        {errors.description?.type == "minLength" && (
          <span className="error-message">
            {t("write.panel.validations.descriptionMinLength")}
          </span>
        )}
        {errors.description?.type == "required" && (
          <span className="error-message">
            {t("write.panel.validations.descriptionRequired")}
          </span>
        )}
        {errors.content?.type == "required" && (
          <span className="error-message">
            {t("write.panel.validations.contentRequired")}
          </span>
        )}
        {errors.content?.type == "minLength" && (
          <span className="error-message">
            {t("write.panel.validations.contentMinLength")}
          </span>
        )}
      </div>
      <div className=" grid grid-cols-1 gap-3 items-center justify-start">
        {submitErrors?.map((error, index) => (
          <span className="error-message" key={index}>
            {error}
          </span>
        ))}
      </div>
    </div>
  );
}
