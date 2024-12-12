"use client";
import Write from "@/components/Write/Write";
import Viewer from "@/components/Posts/LocalViewer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { FormProvider, useForm } from "react-hook-form";

interface IData {
  name: string;
  description: string;
  content: string;
}
export default function EditorPage() {
  const methods = useForm<IData>();

  return (
    <section className=" min-h-screen">
      <div>
        <div className="w-full mx-auto px-4">
          <h1 className="text-3xl font-bold py-4">Editor de Texto</h1>
        </div>
        <Tabs defaultValue="account" className="w-full px-3">
          <TabsList className="grid w-full items-start grid-cols-2 ">
            <TabsTrigger value="account">Escribir</TabsTrigger>
            <TabsTrigger value="password">Vista previa</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <FormProvider {...methods}>
              <Write />
            </FormProvider>
          </TabsContent>
          <TabsContent value="password">
            <Viewer />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
