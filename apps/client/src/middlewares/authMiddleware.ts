import {
  NextResponse,
  type NextFetchEvent,
  type NextRequest,
} from "next/server";
import { CustomMiddleware } from "./chain";
import { IAuthData } from "@/interfaces/authData.interface";
import { getAuthData } from "@/lib/getAuthData";

const proteced: string[] = [];
const baseRegex: string = "^/([a-z]{2})/";

export function authMiddleware(middleware: CustomMiddleware) {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;
    const authData: IAuthData | null = await getAuthData();

    const isProtectedRoute: boolean = proteced.some((route) => {
      const regex: RegExp = new RegExp(baseRegex + route);
      return regex.test(pathname);
    });
    if (!authData && isProtectedRoute)
      return NextResponse.redirect(new URL("/es", request.url));

    return middleware(request, event, response);
  };
}
