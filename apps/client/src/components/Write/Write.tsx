import React, { useRef } from "react";
import { Textarea } from "../ui/textarea";
import Info from "./Info";
import { toast } from "@/hooks/use-toast";
import ControlPanel from "./ControlPanel";
import { useWrite } from "@/hooks/useWrite";
import WriteSEO from "@/components/Write/WriteSeo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
interface IData {
  name: string;
  description: string;
  content: string;
}
function Write() {
  const { text, index, add } = useWrite();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const methods = useForm();
  const { register } = useFormContext<IData>();

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

  return (
    <section className="p-2mx-auto flex flex-col justify-between w-full ">
      <ControlPanel handleEdit={handleEdit} />
      <FormProvider {...methods}>
        <div className="flex flex-col-reverse lg:flex-row  overflow-hidden gap-4 py-5">
          <div className="flex-1 pt-4 min-h-0">
            <Textarea
              {...register("content", { required: true, minLength: 200 })}
              ref={textAreaRef}
              placeholder="Escribe tu texto aquí..."
              className="py-6 text-area-data w-full  h-full min-h-[500px] ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
              value={text[index]}
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
