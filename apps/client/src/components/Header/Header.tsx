import { Link } from "@/i18n/routing";
import { IAuthData } from "@/interfaces/authData.interface";
import { getAuthData } from "@/lib/getAuthData";
import SelectLang from "@/components/Header/selectLanguaje";
import ThemeSelector from "@/components/Header/themeSelector";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import UserAvatar from "./userAvatart";
async function Header() {
  const user: IAuthData | null = await getAuthData();
  const t = await getTranslations("header");
  return (
    <section>
      <header className="flex gap-5 justify-between w-full min-w-[500px] bg-[#F2F2F2] px-3 py-1 dark:bg-[#0D0D0D]  border-b border-border shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-background/80">
        <div className="flex items-center">
          <Link href={{ pathname: "/" }}>
            <h1 className="font-bold text-xl">Write Any Sh*t</h1>
          </Link>
        </div>
        <div className="flex justify-center gap-6">
          <div className="flex items-center">
            <ThemeSelector />
            <SelectLang />
          </div>
          <Separator orientation="vertical" />
          <nav className="flex gap-2 my-1">
            {!user ? (
              <>
                <Button className="bg-[#F2CB57] hover:bg-[#D9A441]">
                  <Link href={{ pathname: "/sign-up" }}>{t("signUp")}</Link>
                </Button>
                <Button className="bg-[#518C4F] hover:bg-[#406441]">
                  <Link href={{ pathname: "/sign-in" }}>{t("signIn")}</Link>
                </Button>
              </>
            ) : (
              <div>
                <UserAvatar
                  username={user.username}
                  img={user.img}
                  id={user.id}
                />
              </div>
            )}
          </nav>
        </div>
      </header>
    </section>
  );
}

export default Header;
