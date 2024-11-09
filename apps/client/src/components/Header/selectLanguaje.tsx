"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import EnSvg from "../../assets/en.svg";
import EsSvg from "../../assets/es.svg";
import { useParams } from "next/navigation";
import cookies from "js-cookie";
export default function ComboboxDemo() {
  const t = useTranslations();
  const [isPending, startTransition] = React.useTransition();
  const lang: string = useLocale();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locales: { value: string; label: string }[] = [
    {
      value: "es",
      label: t("locales.es"),
    },
    {
      value: "en",
      label: t("locales.en"),
    },
  ];

  const [open, setOpen] = React.useState(false);
  const onChangeLocale = async (newLocale: string) => {
    startTransition(() => {
      replace({ pathname, params }, { locale: newLocale });
    });
    setOpen(false);
    cookies.set("was_locale", newLocale);
  };

  React.useEffect(() => {
    cookies.set("was_locale", lang);
  }, [lang]);

  return (
    <div className="w-auto flex items-center  gap-5">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="link"
            className=""
            role="combobox"
            aria-expanded={open}
          >
            {lang == "es" ? (
              <div className="flex gap-3 ">
                <Image src={EsSvg} width={20} alt={locales[0].label} />
              </div>
            ) : (
              <div className="flex gap-3 ">
                <Image src={EnSvg} width={20} alt={locales[1].label} />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[130px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {locales.map((locale, index) => {
                  return (
                    <CommandItem
                      value={locale.value}
                      onSelect={onChangeLocale}
                      key={index}
                    >
                      <Image
                        src={index == 1 ? EnSvg : EsSvg}
                        width={20}
                        alt={locale.label}
                      />
                      {locale.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
