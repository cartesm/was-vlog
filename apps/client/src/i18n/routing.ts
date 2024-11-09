import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales: string[] = ["en", "es"];
export const publicRoutes = ["/", "/sign-in", "/sign-up"];
export const routing = defineRouting({
  locales: locales,
  defaultLocale: "es",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
