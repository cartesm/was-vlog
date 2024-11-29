import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ITagsPagination, searchTags } from "@/lib/api/tags";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { debounce } from "lodash";
export default function SearchTags({ isOpen, changeOpen, setTags }) {
  const [query, setQuery] = useState<string>("");
  const t = useTranslations();
  const [order, setOrder] = useState<number>(1);
  const [errors, setErrors] = useState<string>("");
  const [resultTags, setResultTags] = useState<ITagsPagination | null>(null);
  const [page, setPage] = useState<number>(1);

  const handleSearch = async () => {
    const { data, errors } = await searchTags(page, order, query);
    if (errors) {
      setErrors(errors);
      return;
    }
    setResultTags(data ? data : null);
    setPage(data?.page ? data?.page : 1);
  };

  const handleClickPaginate = (value: number) => {
    const goto: number = page + value;
    if (!resultTags || !resultTags.totalDocs) return;
    if (goto > resultTags?.totalPages || goto <= 0) return;
    setPage(goto);
  };

  const debounceSerch = debounce(handleSearch, 1000);

  useEffect(() => {
    setPage(1);
    handleSearch();
  }, [isOpen, order]);

  useEffect(() => {
    handleSearch();
  }, [page]);

  return (
    <Dialog open={isOpen} onOpenChange={changeOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("tags.title")}</DialogTitle>
          <DialogContent>
            <div className="p-4 min-w-2xl  w-full">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-wrap items-center gap-3">
                  <Input
                    onKeyUp={() => debounceSerch()}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="col-span-4 "
                    placeholder={t("tags.placeholder")}
                  />
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
                    <SelectTrigger className="w-[180px]">
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
              <div className="flex flex-wrap gap-2 py-4 flex-row ">
                {errors && <span className="error-message">{errors}</span>}
                {!errors && resultTags && (
                  <>
                    {resultTags.docs.map((tags) => (
                      <Badge className="px-3 py-1 " key={tags.name}>
                        {tags.name}
                        <Button
                          onClick={() => {
                            setTags(
                              (actual: [{ _id: string; name: string }]) => {
                                const newTag: { _id: string; name: string } = {
                                  _id: tags._id,
                                  name: tags.name,
                                };

                                if (
                                  actual.some(
                                    (tag: { _id: string; name: string }) =>
                                      tag._id == newTag._id
                                  )
                                )
                                  return actual;

                                return [...actual, newTag];
                              }
                            );
                          }}
                          className="rounded-full max-w-3 max-h-6 ml-2"
                          variant={"default"}
                        >
                          <Plus />
                        </Button>
                      </Badge>
                    ))}
                    <Pagination className="pt-3">
                      <PaginationContent>
                        {/* primer item */}
                        <PaginationItem
                          onClick={() => handleClickPaginate(-1)}
                          className="rounded-full p-2 hover:bg-secondary  hover:cursor-pointer"
                        >
                          <ChevronLeft />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setPage(1)}
                            className={`rounded-full hover:cursor-pointer ${page == 1 && "bg-green-500"} `}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {/* paginacion intermedia */}
                        {resultTags.totalPages > 1 && (
                          <>
                            {page <= 3 ? (
                              [2, 3, 4].map((item) => (
                                <PaginationItem key={item}>
                                  <PaginationLink
                                    onClick={() => setPage(item)}
                                    className={`rounded-full hover:cursor-pointer ${page == item && "bg-green-500"} `}
                                  >
                                    {item}
                                  </PaginationLink>
                                </PaginationItem>
                              ))
                            ) : (
                              <>
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                                {[page - 1, page, page + 1]
                                  .filter(
                                    (thisPage) =>
                                      thisPage <= resultTags.totalPages &&
                                      thisPage != resultTags.totalPages
                                  )
                                  .map((item) => (
                                    <PaginationItem key={item}>
                                      <PaginationLink
                                        onClick={() => setPage(item)}
                                        className={`rounded-full hover:cursor-pointer ${page == item && "bg-green-500"} `}
                                      >
                                        {item}
                                      </PaginationLink>
                                    </PaginationItem>
                                  ))}
                              </>
                            )}
                          </>
                        )}
                        {/* item final y separador */}
                        {resultTags.totalPages != 1 &&
                          resultTags.totalPages > 4 && (
                            <>
                              {resultTags.totalPages - 1 != page && (
                                <PaginationItem>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              )}
                              <PaginationItem>
                                <PaginationLink
                                  onClick={() => setPage(resultTags.totalPages)}
                                  className={`rounded-full hover:cursor-pointer ${page == resultTags.totalPages && "bg-green-500"} `}
                                >
                                  {resultTags.totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            </>
                          )}
                        <PaginationItem
                          onClick={() => handleClickPaginate(+1)}
                          className="rounded-full p-2 hover:bg-secondary hover:cursor-pointer"
                        >
                          <ChevronRight />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
