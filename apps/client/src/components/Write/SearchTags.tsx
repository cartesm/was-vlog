import { ITagsPagination, searchTags } from "@/lib/api/tags";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
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
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { useWriteTags } from "@/hooks/write/useTags";
import dynammic from "next/dynamic";
const Paginate = dynammic(() => import("@/components/Pagination"), {
  ssr: true,
});
export default function SearchTags({ isOpen, changeOpen }) {
  const t = useTranslations();
  const [query, setQuery] = useState<string>("");
  const [order, setOrder] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const { errors, set: setErrors } = useFetchErrors();
  const { add: addTag } = useWriteTags();
  const [resultTags, setResultTags] = useState<ITagsPagination | null>(null);

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
  const debounceSerch = debounce(handleSearch, 700);

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
                <div>
                  {errors?.map((error, index) => (
                    <span className="error-message" key={index}>
                      {error}
                    </span>
                  ))}
                </div>
                {resultTags?.docs.map((tags) => (
                  <Badge className="px-3 py-1 " key={tags.name}>
                    {tags.name}
                    <Button
                      onClick={() => {
                        addTag(tags);
                      }}
                      className="rounded-full max-w-3 max-h-6 ml-2"
                      variant={"default"}
                    >
                      <Plus />
                    </Button>
                  </Badge>
                ))}
                {resultTags && (
                  <Paginate
                    actual={page}
                    total={resultTags?.totalPages as number}
                    setPage={setPage}
                    handleClickPaginate={handleClickPaginate}
                  />
                )}
              </div>
            </div>
          </DialogContent>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
