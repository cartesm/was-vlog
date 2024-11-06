"use client";

import * as React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
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
import EnSvg from "../assets/en.svg";
import EsSvg from "../assets/es.svg";
import Cookies from "js-cookie";

export default function ComboboxDemo() {
  const t = useTranslations();
  const {} = useLocale();
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
  const [value, setValue] = React.useState("");

  const setLocale = (locale: string) => {
    Cookies.set("was_locale", locale);
  };

  React.useEffect(() => {
    const locale: string | undefined = Cookies.get("was_locale");
    if (locale) setValue(locale);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className=""
          role="combobox"
          aria-expanded={open}
        >
          {value ? (
            locales.map((locale, index) => {
              if (locale.value === value)
                return (
                  <div className="flex gap-3 " key={index}>
                    <Image
                      src={index == 0 ? EsSvg : EnSvg}
                      width={20}
                      alt={locales[index].label}
                    />
                  </div>
                );
            })
          ) : (
            <div className="flex gap-3 " key={0}>
              <Image
                src={0 == 0 ? EsSvg : EnSvg}
                width={20}
                alt={locales[0].label}
              />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[130px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Locale not found</CommandEmpty>
            <CommandGroup>
              {locales.map((locale, index) => {
                return (
                  <CommandItem
                    value={locale.value}
                    onSelect={() => {
                      if (locale.value === value) setOpen(false);
                      setLocale(locale.value);
                      window.location.replace(
                        window.location.href.replace(value, locale.value)
                      );
                    }}
                    key={index}
                  >
                    {locale.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
