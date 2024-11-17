"use client";
import "./htmlStyles.css";
import { useEffect, useState } from "react";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse";
function Viewer({ txt }) {
  const [htmlToRender, setHtmlToRender] = useState<string>("");

  useEffect(() => {
    (async () => {
      const file = await remark().use(remarkParse).use(remarkHtml).process(txt);
      setHtmlToRender(String(file));
    })();
  }, [txt]);

  // TODO: terminar esta wea
  // TODO: añadir las funcionalidades al menu
  //TODO: crear el historial

  if (!htmlToRender) return <section>dsalidhuya</section>;

  return (
    <section
      className="container-html max-w-3xl mx-auto w-full py-12 mt-3 rounded-md px-6 bg-secondary"
      dangerouslySetInnerHTML={{ __html: htmlToRender }}
    ></section>
  );
}

export default Viewer;
