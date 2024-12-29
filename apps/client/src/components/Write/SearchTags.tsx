import { createTag, ITags, searchTags } from "@/lib/api/posts/tags";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { debounce, DebouncedFuncLeading, throttle } from "lodash";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { useWriteTags } from "@/hooks/write/useTags";
import dynammic from "next/dynamic";
import { DialogDescription } from "@radix-ui/react-dialog";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { Tabs, TabsList } from "@radix-ui/react-tabs";
import { TabsContent, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
const Paginate = dynammic(() => import("@/components/Pagination"), {
  ssr: true,
});
interface ICreateTag {
  name: string;
}
export default function SearchTags({ isOpen, changeOpen }) {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { errors, set: setErrors, removeAll } = useFetchErrors();
  const { add: addTag, tags: writeTags, delete: deleteTag } = useWriteTags();
  const [resultTags, setResultTags] = useState<IPaginationData<ITags> | null>(
    null
  );
  const {
    formState: { errors: formErrors },
    register,
    handleSubmit,
  } = useForm<ICreateTag>();

  const handleSearch = async (optionalQuery?: string) => {
    const { data, error }: IRespData<IPaginationData<ITags>> = await searchTags(
      page,
      1,
      optionalQuery ? optionalQuery : query
    );
    if (error) return setErrors(error);
    setResultTags(data ? data : null);
    setPage(data?.page ? data?.page : 1);
  };

  const onSubmit = async (data: ICreateTag) => {
    const { data: respData, error }: IRespData<string> = await createTag(data);
    if (error)
      return toast({
        title: "Error al crear etiqueta",
        description: error[0],
        variant: "destructive",
      });

    toast({ title: "Etiqueta", description: respData });
  };

  const debounceSearch: DebouncedFuncLeading<(optionalQuery?: string) => any> =
    useCallback(debounce(handleSearch, 700), []);

  const throttledOnclick: DebouncedFuncLeading<(data: ICreateTag) => void> =
    useCallback(throttle(onSubmit, 1400), []);

  useEffect(() => {
    handleSearch();
  }, [page]);

  return (
    <Dialog open={isOpen} onOpenChange={changeOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Ver y editar etiquetas para este producto
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Las etiquetas adecuadas deberían ser términos que otros usuarios
            verían como útiles a la hora de explorar contenido.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="search">Buscar</TabsTrigger>
                <TabsTrigger value="create">Crear</TabsTrigger>
              </TabsList>
              <TabsContent value="search">
                <Input
                  placeholder="Buscar etiquetas..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    debounceSearch(e.target.value);
                  }}
                  className="mb-4"
                />
              </TabsContent>
              <TabsContent value="create">
                <form
                  onSubmit={handleSubmit((data) => throttledOnclick(data))}
                  className="flex gap-2"
                >
                  <Input
                    autoComplete="off"
                    placeholder="Nueva etiqueta"
                    {...register("name", {
                      required: true,
                      minLength: 3,
                      maxLength: 15,
                      pattern: /^[a-zA-Z0-9\s]+$/,
                    })}
                  />
                  <Button type="submit">Añadir</Button>
                </form>
                <div className="flex items-start justify-center flex-col gap-2">
                  {formErrors.name?.type == "required" && (
                    <span className="error-message">Escribe algo primero</span>
                  )}
                  {formErrors.name?.type == "minLength" && (
                    <span className="error-message">
                      El nombre debe ser de minimo 3
                    </span>
                  )}
                  {formErrors.name?.type == "maxLength" && (
                    <span className="error-message">
                      El nombre debe ser de maximo 15
                    </span>
                  )}
                  {formErrors.name?.type == "pattern" && (
                    <span className="error-message">
                      EL nombre debe ser solo texto y/o numero
                    </span>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            {/* resultados de busqueda */}
            <ScrollArea className="h-[300px] pr-4">
              {errors?.map((err, index) => (
                <span key={index} className="errors-message">
                  {err}
                </span>
              ))}
              {resultTags != null && resultTags.docs.length >= 0 ? (
                resultTags?.docs.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between group rounded-lg px-2 py-1 hover:bg-muted"
                  >
                    <span className="text-sm text-muted-foreground">
                      {tag.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => addTag(tag)}
                      disabled={writeTags.some(
                        (actual) => actual._id == tag._id
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  No hay resultados
                </div>
              )}
            </ScrollArea>
            {/* paginacion */}
            <div className="flex items-start justify-center flex-col">
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((actual) => (actual - 1 <= 0 ? actual - 1 : actual))
                  }
                  disabled={page === resultTags?.page}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((actual) => actual + 1)}
                  disabled={page == resultTags?.totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                Página {page} de {resultTags?.totalPages}
              </span>
            </div>
          </div>
          {/* mostrar etiquetas seleccionadas */}
          <div className="space-y-4">
            <h3 className="font-medium">Etiquetas seleccionadas</h3>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {writeTags.length <= 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Todavía no se han aplicado etiquetas
                  </p>
                ) : (
                  writeTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center justify-between my-2 px-3 py-2"
                    >
                      {tag.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2 hover:bg-transparent"
                        onClick={() => deleteTag(tag._id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
