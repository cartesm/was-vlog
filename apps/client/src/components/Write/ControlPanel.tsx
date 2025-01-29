import Compressor from "compressorjs";
import { Button } from "../ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  ImageIcon,
  LinkIcon,
  MessageSquareQuote,
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
import { useTranslations } from "next-intl";

function ControlPanel({ handleEdit }: { handleEdit: (value: string) => void }) {
  const [modalState, setModalState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const openModal = () => setModalState(!modalState);
  const t = useTranslations();
  const handleChange = (e) => {
    const img: File | null = e.target.files ? e.target.files[0] : null;
    if (!img)
      return toast({
        title: t("notAceptable"),
        description: t("image.imageNotSelected"),
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
          title: t("image.uploadCorrect"),
          description: resp.message,
        });
        handleEdit(`\n![Image](${resp.url})  `);
        setModalState(false);
      },
      error(error) {
        setIsLoading(false);
        toast({
          title: "Error",
          description: t("image.errorToOptimize"),
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
        description: t("image.badUrl"),
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
            <p>{t("write.panel.bold")}</p>
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
            <p>{t("write.panel.italic")}</p>
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
            <p>{t("write.panel.list")}</p>
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
            <p>{t("write.panel.ordered_list")}</p>
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
            <p>{t("write.panel.title")}</p>
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
            <p>{t("write.panel.subtitle")}</p>
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
            <p>{t("write.panel.quote")}</p>
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
                <p>{t("write.panel.image")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full">
          <DialogTitle className="py-3">{t("image.panel.add")}</DialogTitle>
          <form
            onSubmit={(e) => e.preventDefault()}
            encType="multipart/form-data"
          >
            <div className=" flex gap-3 flex-col">
              <Label htmlFor="imageInput">{t("image.panel.add")}</Label>
              <Input
                autoComplete="off"
                type="file"
                id="imageInput"
                accept=".jpg , .png , .jpge "
                onChange={handleChange}
              />
              <Label htmlFor="textInputImage">{t("image.panel.or")}</Label>
              <Input
                placeholder={t("image.panel.paste")}
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
            <p>{t("write.panel.link")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default ControlPanel;
