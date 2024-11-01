import { NextRequest, NextResponse, type NextFetchEvent } from "next/server";
import { CustomMiddleware } from "./chain";

const locales: string[] = ["es", "en"];

export function i18nMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;
    console.log(pathname);
    if (!locales.some((locale) => pathname.startsWith(`/${locale}`)))
      return NextResponse.redirect(new URL("/es", request.url));

    return middleware(request, event, response);
  };
}
