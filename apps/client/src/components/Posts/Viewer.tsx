"use client";
import { TypeRender } from "@/interfaces/posts.interface";
import "./htmlStyles.css";
import { FileX2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
function Viewer({ content, type }: { content: string; type: TypeRender }) {
  if (!content)
    return (
      <section className="container-html max-w-3xl mx-auto w-full py-12 mt-3 rounded-md px-6 bg-secondary flex items-center justify-center">
        <FileX2 />
        <span>Nada que mostrar</span>
      </section>
    );

  return (
    <section
      className={`container-html max-w-3xl mx-auto w-full mt-3 ${type == TypeRender.Write && "overflow-y-auto rounded-md max-h-[500px] "} px-6 bg-secondary`}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </section>
  );
}

export default Viewer;
