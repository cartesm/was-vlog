import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { locales, publicRoutes, routing } from "@/i18n/routing";
import { getAuthData as isAuth } from "@/lib/getAuthData";
import { IAuthData } from "./interfaces/authData.interface";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";

const intlMiddleware = createIntlMiddleware(routing);
const onlyWithoutSession: string[] = ["/sign-in", "/sign-up"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoged: IAuthData | null = await isAuth();
  console.log(pathname);
  const isValidLocale: boolean = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (!isValidLocale) {
    return NextResponse.redirect(new URL("/es", req.url));
  }
  const locale: string = await getLocale();

  const matchRegex = (routes: string[], toTest: string): boolean => {
    const dynamicRoutes = routes.map((route) =>
      route.includes(":") ? route.replace(/:([^/]+)/g, "([^/]+)") : route
    );
    return new RegExp(
      `^(/(${locales.join("|")}))?(${dynamicRoutes
        .flatMap((route) => (route === "/" ? ["", "/"] : route))
        .join("|")})/?$`,
      "i"
    ).test(toTest);
  };

  //auth
  if (matchRegex(publicRoutes, pathname)) {
    // rutas publicas
    if (isLoged && matchRegex(onlyWithoutSession, pathname))
      return NextResponse.redirect(new URL("/", req.url));

    return intlMiddleware(req);
  } else {
    // rutas protegidas
    if (isLoged) {
      (await cookies()).delete("was_redirect_to");
      return intlMiddleware(req);
    }
    const fiveMinutes: number = 300;
    (await cookies()).set(
      "was_redirect_to",
      pathname.replace(`/${locale}`, ""),
      { maxAge: fiveMinutes }
    );
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
  }
}

export const config: MiddlewareConfig = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
