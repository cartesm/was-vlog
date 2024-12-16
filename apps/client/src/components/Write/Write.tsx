import React, { useCallback, useEffect, useRef } from "react";
import { DebouncedFuncLeading, throttle } from "lodash";
import { Textarea } from "../ui/textarea";
import { toast } from "@/hooks/use-toast";
import ControlPanel from "./ControlPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  createPost,
  getOnePost,
  ICreatePost,
  IGetResp,
  IPost,
  IResponseCreate,
  updatePost,
} from "@/lib/api/posts";
import { useLocale } from "next-intl";
import { useTotalWrite } from "@/hooks/useTotalWrite";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "@/i18n/routing";
const Info = dynamic(() => import("@/components/Write/Info"), { ssr: false });
const WriteSeo = dynamic(() => import("@/components/Write/WriteSeo"), {
  ssr: false,
  loading: () => (
    <div>
      <Skeleton className="w-full rounded-md h-[200px] bg-background" />
    </div>
  ),
});
export interface IData {
  name: string;
  description: string;
  content: string;
}
function Write({ param }: { param: string | null }) {
  const lang: string = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (param == "new") return;
    const fetchPost = async () => {
      const { data, error }: IGetResp = await getOnePost(param as string);
      if (error) {
        router.replace("/");
        router.refresh();
        return;
      }
      setNameId((data as IPost).name);
      methods.reset({
        content: data?.content,
        name: data?.name,
        description: data?.description,
      });
    };
    fetchPost();
  }, []);

  const methods = useForm<IData>({
    defaultValues: { content: "", name: "", description: "" },
  });
  const { setErrors, id: nameId, setId: setNameId, tags } = useTotalWrite();
  const textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);

  const handleEdit = (value: string) => {
    const selection: string | undefined = window.getSelection()?.toString();
    const selectedArea = textAreaRef.current;
    if (!selectedArea)
      return toast({
        title: "error",
        description: "ref not definded",
        variant: "destructive",
      });

    const start: number = selectedArea.selectionStart;
    const end: number = selectedArea.selectionEnd;
    const actual: string = selectedArea.value;
    if (!selection) {
      const newChange: string =
        actual.slice(0, start) + value + actual.slice(end, actual.length);
      selectedArea.value = newChange;
      return;
    }

    const newChange: string =
      actual.slice(0, start) +
      value.replace("ExampleTextWas", `${actual.substring(start, end)}`) +
      actual.slice(end, actual.length);

    selectedArea.value = newChange;
    return;
  };
  const onSubmit: SubmitHandler<IData> = async (data: IData) => {
    const createData: ICreatePost = {
      ...data,
      name: data.name.trimEnd(),
      content: data.content,
      languaje: lang,
      tags: tags.length ? tags.map(({ _id }) => ({ _id })) : undefined, // Procesar tags en línea si existen.
    };

    const resp: IResponseCreate = !nameId
      ? await createPost(createData)
      : await updatePost({ ...createData, name: undefined }, nameId);

    if (!resp.error) {
      toast({ title: "Exito", description: resp.message });
      if (!nameId) setNameId(createData.name);
      return;
    }
    setErrors(resp.message);

    const timer = setTimeout(() => {
      setErrors([]);
      return clearTimeout(timer);
    }, 3000);
  };
  const throttledSubmit: DebouncedFuncLeading<(data: IData) => void> =
    useCallback(
      throttle(
        (data: IData) => {
          onSubmit(data);
        },
        3000,
        { trailing: false }
      ),
      []
    );

  return (
    <section className="p-2mx-auto flex flex-col justify-between w-full ">
      <ControlPanel handleEdit={handleEdit} />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) => {
            throttledSubmit(data);
          })}
          id="write-form"
        ></form>
        <div className="flex flex-col-reverse lg:flex-row  overflow-hidden gap-4 py-5">
          <div className="flex-1 pt-4 min-h-0">
            <Textarea
              {...methods.register("content", {
                required: true,
                minLength: 200,
              })}
              form="write-form"
              spellCheck={false}
              ref={(instance) => {
                methods.register("content").ref(instance);
                if (instance && textAreaRef.current === null) {
                  textAreaRef.current = instance;
                }
              }}
              placeholder="Escribe tu texto aquí..."
              className="py-6 text-area-data w-full  h-full min-h-[500px] ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            />
          </div>
          <Tabs
            defaultValue="seo"
            className="w-full lg:w-1/3 rounded-md p-2 bg-secondary"
          >
            <TabsList>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="info">DOCS</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <Info />
            </TabsContent>
            <TabsContent value="seo">
              <WriteSeo />
            </TabsContent>
          </Tabs>
        </div>
      </FormProvider>
    </section>
  );
}

export default Write;
