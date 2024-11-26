"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "../ui/input";
import { Plus, Search, Trash } from "lucide-react";
import { format } from "@formkit/tempo";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ITagsPagination, searchTags } from "@/lib/api/tags";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function CompactSection() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([
    { _id: "dihfkudhfdf", name: "sdjhskdjh" },
  ]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const changeOpen = () => setIsOpen(!isOpen);

  return (
    <div className="bg-background p-4 my-4 rounded-lg ">
      <SearchTag isOpen={isOpen} changeOpen={changeOpen} />
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          value={title}
          placeholder="TITULO"
          autoFocus
          className="text-xl  px-3 py-2 font-bold outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
          onChange={(e) => setTitle(e.target.value)}
        />

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
          placeholder="Descripción breve..."
          className="h-full  outline-none ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
        />
      </form>
    </div>
  );
}

const SearchTag = ({ isOpen, changeOpen }) => {
  const [query, setQuery] = useState<string>("");
  const t = useTranslations();
  const [order, setOrder] = useState<number>(1);
  const [errors, setErrors] = useState<string>("");
  const [resultTags, setResultTags] = useState<ITagsPagination | null>(null);
  const locale = useLocale();
  const handleSearch = async () => {
    const { data, errors } = await searchTags(1, order, query);
    if (errors) {
      setErrors(errors);
      return;
    }
    setResultTags(data ? data : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={changeOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogContent className="bg-primary text-secondary">
            <DialogTitle>Penepne</DialogTitle>
            <div className="p-4">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-5 items-center gap-3">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="col-span-4 bg-secondary text-primary"
                    placeholder="busca una eiqueta"
                  />
                  <Button onClick={handleSearch}>
                    <Search />
                  </Button>
                  <Select
                    defaultValue={order.toString()}
                    onValueChange={(nValue: string) =>
                      setOrder(
                        [1, -1].includes(Number(nValue)) &&
                          !isNaN(Number(nValue))
                          ? Number(nValue)
                          : 1
                      )
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-secondary text-primary">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{t("user.posts.orderBy")}</SelectLabel>
                        <SelectItem value="1">{t("user.posts.new")}</SelectItem>
                        <SelectItem value="-1">
                          {t("user.posts.old")}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </form>
              <div className="flex items-center justify-start w-full gap-2 py-4 flex-col mah-h-[300px] overflow-y-auto">
                {errors && <span className="error-message">{errors}</span>}
                {resultTags?.docs.map((tags) => (
                  <div
                    className="bg-secondary text-primary px-3 py-1 rounded-md w-full flex items-center justify-between "
                    key={tags.name}
                  >
                    <span>{tags.name} </span>
                    <Link
                      className="text-sm"
                      href={`/users/${tags.createdBy._id}`}
                    >
                      {tags.createdBy.username}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
