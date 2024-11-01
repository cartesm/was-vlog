import { chain } from "./middlewares/chain";
import { i18nMiddleware } from "./middlewares/i18nMiddleware";
import { authMiddleware } from "./middlewares/authMiddleware";
const middlewares = [i18nMiddleware, authMiddleware];

export default chain(middlewares);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
