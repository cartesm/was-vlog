import React, { SetStateAction, useRef } from "react";
import { Textarea } from "../ui/textarea";
import Info from "./Info";
import { toast } from "@/hooks/use-toast";
import ControlPanel from "./ControlPanel";
function Write({
  currentText,
  setCurrentText,
  index,
  setIndex,
}: {
  currentText: string;
  setCurrentText: SetStateAction<any>;
  index: number;
  setIndex: SetStateAction<any>;
}) {
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

    if (!selection) {
      setCurrentText((actual: string) => {
        const start: number = selectedArea.selectionStart;
        const end: number = selectedArea.selectionEnd;
        const newChange: string =
          actual.slice(0, start) +
          value +
          currentText.slice(end, actual.length);
        return newChange;
      });
      selectedArea.scroll({
        top: selectedArea.scrollHeight,
      });
      return;
    }

    const start: number = selectedArea.selectionStart;
    const end: number = selectedArea.selectionEnd;
    const newChange: string =
      currentText.slice(0, start) +
      value.replace("ExampleTextWas", `${currentText.substring(start, end)}`) +
      currentText.slice(end, currentText.length);

    setCurrentText(newChange);
  };

  return (
    <section className="p-2">
      <ControlPanel handleEdit={handleEdit} setIndex={setIndex} />
      <div className="flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 pt-4 pr-4 min-h-0">
          <Textarea
            ref={textAreaRef}
            placeholder="Escribe tu texto aquí..."
            className="py-6 text-area-data w-full h-full min-h-[500px] ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
            value={currentText}
            onChange={(e) =>
              setCurrentText((actual: string[]) => {
                console.log("sakdjsa: ", currentText + e.target.value);
                return [e.target.value];
              })
            }
          />
        </div>
        <Info currentText={currentText} />
      </div>
    </section>
  );
}

export default Write;
