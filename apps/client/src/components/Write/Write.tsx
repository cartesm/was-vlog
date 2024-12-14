import React, { useEffect, useRef } from "react";
import { Textarea } from "../ui/textarea";
import Info from "./Info";
import { toast } from "@/hooks/use-toast";
import ControlPanel from "./ControlPanel";
import { useWrite } from "@/hooks/useWrite";
import WriteSEO from "@/components/Write/WriteSeo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  createPost,
  ICreatePost,
  IResponseCreate,
  updatePost,
} from "@/lib/api/posts";
import { useLocale } from "next-intl";
import { useTotalWrite } from "@/hooks/useTotalWrite";
export interface IData {
  name: string;
  description: string;
  content: string;
}
function Write() {
  const lang: string = useLocale();
  const { text, index, add } = useWrite();
  const textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null> =
    useRef(null);
  const methods = useForm<IData>();
  const { setErrors, id: nameId, setId: setNameId, tags } = useTotalWrite();
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
    const actual: string = text[index];
    if (!selection) {
      const newChange: string =
        actual.slice(0, start) + value + actual.slice(end, actual.length);
      add(newChange);
      return;
    }

    const newChange: string =
      actual.slice(0, start) +
      value.replace("ExampleTextWas", `${actual.substring(start, end)}`) +
      actual.slice(end, actual.length);

    add(newChange);
    return;
  };

  const onSubmit: SubmitHandler<IData> = async (data: IData) => {
    const createData: ICreatePost = {
      ...data,
      name: data.name.trimEnd(),
      content: text[index],
      languaje: lang,
    };
    if (tags.length >= 1) {
      const parsedTags: { _id: string }[] = tags.map((actual) => ({
        _id: actual._id,
      }));
      createData.tags = parsedTags;
    }
    let resp: IResponseCreate;

    if (!nameId) resp = await createPost(createData);
    else {
      delete (createData as any).name;
      resp = await updatePost(createData, nameId);
    }

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

  return (
    <section className="p-2mx-auto flex flex-col justify-between w-full ">
      <ControlPanel handleEdit={handleEdit} />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} id="write-form"></form>
        <div className="flex flex-col-reverse lg:flex-row  overflow-hidden gap-4 py-5">
          <div className="flex-1 pt-4 min-h-0">
            <Textarea
              value={text[index]}
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
              onChange={(e) => add(e.target.value)}
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
              <WriteSEO />
            </TabsContent>
          </Tabs>
        </div>
      </FormProvider>
    </section>
  );
}

export default Write;
