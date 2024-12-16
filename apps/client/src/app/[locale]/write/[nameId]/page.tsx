"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import LoaderSkeleton from "@/components/Write/LoaderSkeleton";
const Writer = dynamic(() => import("@/components/Write/Write"), {
  ssr: false,
  loading: () => <LoaderSkeleton />,
});
const Viewer = dynamic(() => import("@/components/Posts/LocalViewer"), {
  ssr: false,
  loading: () => (
    <section className="container-html max-w-3xl mx-auto w-full py-12 mt-3 rounded-md px-6 bg-secondary flex flex-col items-center justify-center">
      <Loader />
      <span>Cargando...</span>
    </section>
  ),
});
export default function EditorPage() {
  const { nameId }: { nameId: string } = useParams();
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
            <Writer param={nameId} />
          </TabsContent>
          <TabsContent value="password">
            <Viewer text="pene" />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
