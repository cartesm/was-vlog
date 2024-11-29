import Compressor from "compressorjs";
import { Button } from "../ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Save,
  Heading1,
  Heading2,
  ImageIcon,
  LinkIcon,
  MessageSquareQuote,
  Redo,
  Undo,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { IRespondImage, uploadImage } from "@/lib/api/images";
import { Spinner } from "../ui/spiner";
import { useState } from "react";
import { useWrite } from "@/hooks/useWrite";

function ControlPanel({ handleEdit }: { handleEdit: (value: string) => void }) {
  const [modalState, setModalState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { traveling } = useWrite();
  const openModal = () => setModalState(!modalState);

  const handleChange = (e) => {
    const img: File | null = e.target.files ? e.target.files[0] : null;
    if (!img)
      return toast({
        title: "Error",
        description: "selecciona una imagen",
        variant: "destructive",
      });
    setIsLoading(true);
    new Compressor(img, {
      quality: 0.6,
      async success(result) {
        const formData: FormData = new FormData();
        formData.append("img", result);
        const resp: IRespondImage = await uploadImage(formData);
        setIsLoading(false);
        if (!resp.url) {
          e.target.value = "";
          return toast({
            title: "Error",
            description: resp.message,
            variant: "destructive",
          });
        }
        toast({
          title: "image uploiad",
          description: resp.message,
        });
        handleEdit(`\n![Image](${resp.url})  `);
        setModalState(false);
      },
      error(error) {
        setIsLoading(false);
        console.error(error);
        toast({
          title: "Error",
          description: "error al subir la imagen",
          variant: "destructive",
        });
      },
    });
  };

  const handlePaste = (e) => {
    const pasteText: string = e.clipboardData.getData("text");
    const isValidUrl: boolean = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ).test(pasteText);
    if (!isValidUrl) {
      toast({
        title: "Error",
        description: "Ingresa una url valida",
        variant: "destructive",
      });
      return;
    }
    handleEdit(`\n![Image](${pasteText})  `);
    setModalState(false);
  };

  return (
    <div className="flex flex-wrap gap-2 pt-3 overflow-x-auto">
      {/* BOLD */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEdit("\n**ExampleTextWas**  ")}
            >
              <Bold />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Negrita</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* ITALIC */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEdit("\n_ExampleTextWas_  ")}
            >
              <Italic />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cursiva</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* UL */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => handleEdit(`\n- FirtsItem  \n- SecondItem  `)}
              variant="secondary"
              size="sm"
            >
              <List />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lista</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* OL */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => handleEdit(`\n1. ListItem  \n2. SecondItem  `)}
              variant="secondary"
              size="sm"
            >
              <ListOrdered />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lista Ordenada</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* TITLE */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEdit("\n## ExampleTextWas  ")}
            >
              <Heading1 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Titulo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* SUBTITLE */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEdit("\n### ExampleTextWas  ")}
            >
              <Heading2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Subtitulo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* REFERENCE */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEdit("\n> ExampleTextWas  ")}
            >
              <MessageSquareQuote />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cita</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* IMAGE */}
      <Dialog open={modalState} onOpenChange={openModal}>
        <DialogTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="secondary" size="sm">
                  <ImageIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Imagen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full">
          <DialogTitle className="py-3">Añade una imagen</DialogTitle>
          <form
            onSubmit={(e) => e.preventDefault()}
            encType="multipart/form-data"
          >
            <div className=" flex gap-3 flex-col">
              <Label htmlFor="imageInput">Sube una imagen</Label>
              <Input
                autoComplete="off"
                type="file"
                id="imageInput"
                accept=".jpg , .png , .jpge "
                onChange={handleChange}
              />
              <Label htmlFor="textInputImage">O ingresa el enlace de una</Label>
              <Input
                placeholder="PEGA una url aqui"
                type="text"
                autoComplete="off"
                id="textInputImage"
                onPaste={handlePaste}
              />
              {isLoading && (
                <div className="mx-auto flex items-center justify-center">
                  <Spinner size={"small"} />
                </div>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* LINK */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                handleEdit("\n[Placeholder](http://www.example.com)  ")
              }
            >
              <LinkIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Enlace</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* ----CONTROL---- */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => traveling(-1)}
              size="sm"
              variant={"secondary"}
            >
              <Undo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Atras</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={() => traveling(1)}
              size="sm"
              variant={"secondary"}
            >
              <Redo />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adelante</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* SAVE */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="default" size="sm">
              <Save />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Guardar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ControlPanel;
