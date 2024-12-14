"use client";
import Write from "@/components/Write/Write";
import Viewer from "@/components/Posts/LocalViewer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTotalWrite } from "@/hooks/useTotalWrite";
import { useWrite } from "@/hooks/useWrite";
import { getOnePost, IGetResp } from "@/lib/api/posts";

export default function EditorPage() {
  const { nameId } = useParams();
  const router = useRouter();
  const { set } = useTotalWrite();
  const [loading, setLoading] = useState<boolean>(true);
  const { add } = useWrite();
  useEffect(() => {
    if (!nameId) {
      router.replace("/");
      router.refresh();
      return;
    }
    if (nameId != "new") {
      getPost();
    }
    setLoading(false);
  }, []);

  const getPost = async () => {
    const { data, error }: IGetResp = await getOnePost(nameId as string);

    if (error) {
      router.replace("/");
      router.refresh();
      return;
    }

    if (!data) return;
    add(data.content);
    set({
      description: data.description,
      name: data.name,
      languaje: data.languaje,
      tags: data.tags,
      id: data.name,
    });
    setLoading(false);
  };

  if (loading) return <span>ctm</span>;

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
            <Write />
          </TabsContent>
          <TabsContent value="password">
            <Viewer />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
