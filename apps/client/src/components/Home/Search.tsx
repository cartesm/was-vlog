"use client";
import {
  ArrowDownAZ,
  ArrowDownZA,
  Minus,
  Plus,
  SortAsc,
  SortDesc,
  Trash,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { debounce, DebouncedFuncLeading } from "lodash";
import { searchPosts } from "@/lib/api/posts/posts";
import { ISimplePostContent } from "@/interfaces/posts.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { error } from "console";
import { PostItem } from "../User/UserContent";
import { useWriteTags } from "@/hooks/write/useTags";
import { Badge } from "../ui/badge";
import SearchTags from "../Write/SearchTags";
import { useFetchErrors } from "@/hooks/useFetchErrors";

function Search() {
  const { tags, delete: deleteTag } = useWriteTags();
  const { errors, set, removeAll } = useFetchErrors();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [alphabeticalOrder, setAlphabeticalOrder] = useState<number>(1);
  const [createdAtOrder, setCreatedAtOrder] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<ISimplePostContent[]>([]);
  const onSubmit = async (queryString?: string) => {
    removeAll();
    // TODO: bug al buscar, etiquetas no aprecen despues de escribir algo despues de borrar allguna
    const resp: IRespData<IPaginationData<ISimplePostContent>> =
      await searchPosts({
        alphabetical: alphabeticalOrder,
        created: createdAtOrder,
        name: queryString ? queryString : searchQuery,
        page,
        ...(tags?.length > 0 && { tags: tags.map((data) => data._id) }),
      });
    if (resp.error) {
      return set(resp.error);
    }
    setPosts(resp.data?.docs as any);
  };
  const submmitHandler: DebouncedFuncLeading<
    (searchQuery: string) => void | Promise<void>
  > = useCallback(
    debounce((searchQuery: string) => onSubmit(searchQuery), 700),
    []
  );

  useEffect(() => {
    onSubmit();
  }, [searchQuery, tags]);

  return (
    <div className="p-6 pb-1 max-w-2xl mx-auto w-full">
      <div className="flex flex-col  gap-2 mb-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex-grow">
            <Input
              placeholder="Buscar posts..."
              onChange={({ target: { value } }) => {
                submmitHandler(value);
                setSearchQuery(value);
              }}
            />
          </div>
        </form>
        <div className="flex gap-3 items-center justify-start">
          <Select defaultValue="asc">
            <SelectTrigger defaultValue={"asc"} className="w-full md:w-[180px]">
              <SelectValue placeholder="Fecha de Creacion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">
                <div className="flex items-center">
                  <SortAsc className="mr-2 h-4 w-4" />
                  Mas Nuevos
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center">
                  <SortDesc className="mr-2 h-4 w-4" />
                  mas Viejos
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="asc">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue defaultValue={"-1"} placeholder="Orden Alfabetico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">
                <div className="flex items-center">
                  <ArrowDownAZ />
                  Ascendente
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center">
                  <ArrowDownZA />
                  Descendente
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {/* tags select */}
          <Button
            onClick={() => setIsOpen((actual) => !actual)}
            variant={"default"}
          >
            <Plus size={15} /> tags
          </Button>
          <div>
            <SearchTags
              isOpen={isOpen}
              changeOpen={() => setIsOpen((actual) => !actual)}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 ">
        {tags.map((tag) => (
          <Badge
            variant={"default"}
            key={tag._id}
            className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2"
            onClick={() => deleteTag(tag._id)}
          >
            {tag.name}
            <Trash size={17} />
          </Badge>
        ))}
      </div>
      <div>
        {errors.length > 0 ? (
          <div className="flex flex-col items-center justify-center w-full">
            {errors.map((err, index) => (
              <span key={index} className="error-message">
                {err}
              </span>
            ))}
          </div>
        ) : (
          posts?.map((data, index) => (
            <PostItem key={index} post={data} index={index} />
          ))
        )}
      </div>
    </div>
  );
}

export default Search;
