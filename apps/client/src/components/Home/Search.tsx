"use client";
import { Plus, SortAsc, SortDesc, Trash } from "lucide-react";
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
import { useWriteTags } from "@/hooks/write/useTags";
import { Badge } from "../ui/badge";
import SearchTags from "../Write/SearchTags";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import NotFound from "../NotFound";
import { PostItem } from "../Posts/PostItem";

function Search() {
  const { tags, delete: deleteTag } = useWriteTags();
  const {
    errors: fetchErrors,
    set: setFetchErrors,
    removeAll,
  } = useFetchErrors();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [createdAtOrder, setCreatedAtOrder] = useState<number>(-1);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<ISimplePostContent[]>([]);
  const [haveMorePage, setHaveMorePage] = useState<boolean>(false);

  const onSubmit = async (queryString?: string, manualPage?: number) => {
    const resp: IRespData<IPaginationData<ISimplePostContent>> =
      await searchPosts({
        alphabetical: 1,
        created: createdAtOrder,
        name: queryString ? queryString : searchQuery,
        page: manualPage ? manualPage : page,
        ...(tags?.length > 0 && { tags: tags.map((data) => data._id) }),
      });

    if (resp.error) {
      setFetchErrors(resp.error);
      return;
    }
    if (resp.data) {
      removeAll();
      setPosts(
        manualPage == 1 ? resp.data.docs : posts.concat(resp.data?.docs)
      );
      setHaveMorePage(resp.data.hasNextPage);
    }
  };

  const submmitHandler: DebouncedFuncLeading<
    (searchQuery: string) => void | Promise<void>
  > = useCallback(
    debounce((searchQuery: string) => onSubmit(searchQuery), 700),
    []
  );

  useEffect(() => {
    setPage(1);
    onSubmit(searchQuery, 1);
  }, [tags, createdAtOrder]);

  return (
    <section className="bg-background">
      <div className="p-6 pb-1 max-w-2xl mx-auto bg-secondary w-full">
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
            <Select
              onValueChange={(value) =>
                setCreatedAtOrder(value == "asc" ? -1 : 1)
              }
              defaultValue="asc"
            >
              <SelectTrigger
                defaultValue={"asc"}
                className="w-full md:w-[180px]"
              >
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
          <div className="flex flex-col items-center justify-center w-full">
            {fetchErrors.map((err, index) => (
              <span key={index} className="error-message">
                {err}
              </span>
            ))}
          </div>
          {posts?.map((data, index) => (
            <PostItem key={index} post={data} index={index} />
          ))}
          {posts.length <= 0 && (
            <div className="min-h-[70vh] flex items-center justify-center">
              <NotFound {...(searchQuery && { query: searchQuery })} />
            </div>
          )}
          {haveMorePage && (
            <Button
              className="text-md"
              onClick={() => {
                onSubmit(searchQuery, page + 1);
                setPage((actual) => actual + 1);
              }}
              variant={"link"}
            >
              Cargar mas
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Search;
