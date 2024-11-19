import React, { useRef } from "react";
import { Textarea } from "../ui/textarea";
import Info from "./Info";
import { toast } from "@/hooks/use-toast";
import ControlPanel from "./ControlPanel";
import { useWrite } from "@/hooks/useWrite";
function Write() {
  const { text, index, add } = useWrite();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
    console.log("actual: ", actual);
    console.log(text[index + 1]);
    console.log(text);
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
    <section className="p-2">
      <ControlPanel handleEdit={handleEdit} />
      <div className="flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 pt-4 pr-4 min-h-0">
          <Textarea
            ref={textAreaRef}
            placeholder="Escribe tu texto aquí..."
            className="py-6 text-area-data w-full h-full min-h-[500px] ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            value={text[index]}
            onChange={(e) => add(e.target.value)}
          />
        </div>
        <Info />
      </div>
    </section>
  );
}

export default Write;
