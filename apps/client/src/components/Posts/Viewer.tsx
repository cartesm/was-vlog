"use client";
import "./htmlStyles.css";
import { useEffect, useState } from "react";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { FileX2, LoaderIcon } from "lucide-react";
import { TypeRender } from "@/app/[locale]/post/[postId]/page";

function Viewer({ content, type }: { content: string; type: TypeRender }) {
  const [htmlToRender, setHtmlToRender] = useState<string>("");
  useEffect(() => {
    (async () => {
      const file = await remark()
        .use(remarkParse)
        .use(remarkHtml)
        .process(content);
      setHtmlToRender(String(file));
    })();
  }, []);

  if (!content)
    return (
      <section className="container-html max-w-3xl mx-auto w-full py-12 mt-3 rounded-md px-6 bg-secondary flex items-center justify-center">
        <FileX2 />
        <span>Nada que mostrar</span>
      </section>
    );

  if (!htmlToRender)
    return (
      <section className="container-html max-w-3xl mx-auto w-full py-12 mt-3 rounded-md px-6 bg-secondary flex items-center justify-center">
        <LoaderIcon />
        <span>Cargando</span>
      </section>
    );

  return (
    <section
      className={`container-html max-w-3xl mx-auto w-full mt-3 ${type == TypeRender.Write && "overflow-y-auto rounded-md max-h-[500px] "} px-6 bg-secondary`}
      dangerouslySetInnerHTML={{ __html: htmlToRender }}
    ></section>
  );
}

export default Viewer;
