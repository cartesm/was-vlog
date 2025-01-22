import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales: string[] = ["en", "es"];
export const publicRoutes = [
  "/",
  "/sign-in",
  "/sign-up",
  "/post/:nameId",
  "/user/:id",
  "/user/:id/followers",
];
export const routing = defineRouting({
  locales: locales,
  defaultLocale: "es",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
