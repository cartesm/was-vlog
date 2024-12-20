"use client";
import React, { useCallback, useEffect, useState } from "react";
import { DebouncedFuncLeading, throttle } from "lodash";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import ControlPanel from "@/components/Write/ControlPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  createPost,
  getOnePost,
  ICreatePost,
  IGetResp,
  IPost,
  IResponseCreate,
  updatePost,
} from "@/lib/api/posts/posts";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { IData } from "@/interfaces/IWriteData.interface";
import LoaderSkeleton from "@/components/Write/LoaderSkeleton";
import { Loader } from "lucide-react";
import { useWriteTags } from "@/hooks/write/useTags";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { TypeRender } from "../../post/[postId]/page";
const Info = dynamic(() => import("@/components/Write/Info"), { ssr: false });
const WriteSeo = dynamic(() => import("@/components/Write/WriteSeo"), {
  ssr: false,
  loading: () => (
    <div>
      <Skeleton className="w-full rounded-md h-[200px] bg-background" />
    </div>
  ),
});
const Previewer = dynamic(() => import("@/components/Posts/Viewer"), {
  ssr: false,
  loading: () => (
    <section className="container-html max-w-3xl mx-auto w-full py-12 mt-3 rounded-md px-6 bg-secondary flex items-center justify-center">
      <Loader />
      <span>Cargando</span>
    </section>
  ),
});

function Write() {
  const { nameId: param }: { nameId: string } = useParams();
  const { tags } = useWriteTags();
  const { set: setErrors, removeAll } = useFetchErrors();
  const lang: string = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPost = async () => {
    const { data, error }: IGetResp = await getOnePost(param as string);
    if (error) {
      router.push("/");
      return;
    }
    methods.reset({
      content: data?.content || "",
      name: data?.name || "",
      description: data?.description || "",
    });
  };

  const methods = useForm<IData>({
    defaultValues: { content: "", name: "", description: "" },
  });
  const handleEdit = (value: string) => {
    return methods.reset({ content: methods.watch("content") + value });
  };
  const onSubmit: SubmitHandler<IData> = async (data: IData) => {
    const createData: ICreatePost = {
      ...data,
      name: data.name.trimEnd(),
      content: data.content,
      languaje: lang,
      tags: tags.length > 0 ? tags.map((tag) => tag._id) : undefined,
    };

    const resp: IResponseCreate = !param
      ? await createPost(createData)
      : await updatePost({ ...createData, name: undefined }, param);

    if (!resp.error) {
      toast({ title: "Exito", description: resp.message });
      return;
    }
    setErrors(resp.message);

    const timer = setTimeout(() => {
      removeAll();
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

  useEffect(() => {
    if (param == "new") return setLoading(false);
    if (param.length < 10) return router.push("/");
    fetchPost();
    return setLoading(false);
  }, []);

  if (loading) {
    return <LoaderSkeleton />;
  }

  return (
    <section className="p-2 mx-auto flex flex-col justify-between w-full ">
      <ControlPanel handleEdit={handleEdit} />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) => {
            throttledSubmit(data);
          })}
          id="write-form"
        ></form>
        <div className="flex flex-col-reverse lg:flex-row  overflow-hidden gap-4 py-5">
          <div className="flex-1 pt-4 ">
            <div className="bg-secondary rounded-md">
              <Tabs
                defaultValue="write"
                className="w-full rounded-md p-2 bg-secondary"
              >
                <TabsList>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <Textarea
                    {...methods.register("content", {
                      required: true,
                      minLength: 200,
                    })}
                    form="write-form"
                    spellCheck={false}
                    placeholder="Escribe tu texto aquí..."
                    className=" py-3 text-area-data w-full bg-secondary  h-full min-h-[500px] ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <Previewer
                    type={TypeRender.Write}
                    content={methods.watch("content")}
                  />
                </TabsContent>
              </Tabs>
            </div>
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
              <WriteSeo nameId={param} />
            </TabsContent>
          </Tabs>
        </div>
      </FormProvider>
    </section>
  );
}

export default Write;
