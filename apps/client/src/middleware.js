import { NextResponse } from "next/server";
export function middleware(request) {
  const authToken = request.cookies.get("was_auth_token");

  if (!authToken) return NextResponse.redirect(new URL("/", request.url));
  //("user_sesion_data",parseJwt(authToken.value))
}
export const config = {
  matcher: ["/protected"],
};
