import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, publicRoutes, routing } from "@/i18n/routing";
import { getAuthData as isAuth } from "@/lib/getAuthData";
import { IAuthData } from "./interfaces/authData.interface";

const intlMiddleware = createIntlMiddleware(routing);
const onlyWithoutSession: string[] = ["/sign-in", "/sign-up"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoged: IAuthData | null = await isAuth();

  const isValidLocale: boolean = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (!isValidLocale) {
    return NextResponse.redirect(new URL("/es", req.url));
  }

  const matchRegex = (routes: string[], toTest: string): boolean => {
    return RegExp(
      `^(/(${locales.join("|")}))?(${routes
        .flatMap((route) => (route === "/" ? ["", "/"] : route))
        .join("|")})/?$`,
      "i"
    ).test(toTest);
  };

  if (matchRegex(publicRoutes, pathname)) {
    if (isLoged && matchRegex(onlyWithoutSession, pathname))
      return NextResponse.redirect(new URL("/", req.url));
    return intlMiddleware(req);
  } else {
    if (isLoged) {
      return intlMiddleware(req);
    }
    return NextResponse.redirect(new URL(`/es/sign-in`, req.url));
  }
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
