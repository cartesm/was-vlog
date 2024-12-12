"use client";
import { useWrite } from "@/hooks/useWrite";
import "./htmlStyles.css";
import { useEffect, useState } from "react";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
import { FileX2 } from "lucide-react";
function Viewer() {
  const [htmlToRender, setHtmlToRender] = useState<string>("");
  const { text, index } = useWrite();
  useEffect(() => {
    (async () => {
      const file = await remark()
        .use(remarkParse)
        .use(remarkHtml)
        .process(text[index]);
      setHtmlToRender(String(file));
    })();
  }, [text, index]);

  if (!htmlToRender)
    return (
      <section className="container-html max-w-3xl mx-auto w-full py-12 mt-3 rounded-md px-6 bg-secondary flex items-center justify-center">
        <FileX2 />
        <span>Nada que mostrar</span>
      </section>
    );

  return (
    <section
      className="container-html max-w-3xl mx-auto w-full py-12 mt-3 rounded-md px-6 bg-secondary"
      dangerouslySetInnerHTML={{ __html: htmlToRender }}
    ></section>
  );
}

export default Viewer;
