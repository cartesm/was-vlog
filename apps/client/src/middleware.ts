import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, publicRoutes, routing } from "@/i18n/routing";
import { getAuthData as isAuth } from "@/lib/getAuthData";

const intlMiddleware = createIntlMiddleware(routing);

const authMiddleware = (req: NextRequest) => {
  const isLoged: boolean = !!isAuth();

  if (!isLoged) {
    return intlMiddleware(req);
  }
  return NextResponse.redirect(new URL(`/es/sign-in`, req.url));
};

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isValidLocale: boolean = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (!isValidLocale) {
    return NextResponse.redirect(new URL("/es", req.url));
  }

  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicRoutes
      .flatMap((route) => (route === "/" ? ["", "/"] : route))
      .join("|")})/?$`,
    "i"
  );

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return authMiddleware(req);
  }
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
