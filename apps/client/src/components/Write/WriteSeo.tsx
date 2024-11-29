"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "../ui/input";
import { Plus, Trash } from "lucide-react";
import SearchTags from "./SearchTags";

export default function CompactSection() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const changeOpen = () => setIsOpen(!isOpen);

  return (
    <div className="bg-background p-4 my-4 rounded-lg ">
      <SearchTags isOpen={isOpen} changeOpen={changeOpen} setTags={setTags} />
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
