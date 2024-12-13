import { Link } from "@/i18n/routing";
import { IAuthData } from "@/interfaces/authData.interface";
import { getAuthData } from "@/lib/getAuthData";
import SelectLang from "@/components/Header/selectLanguaje";
import ThemeSelector from "@/components/Header/themeSelector";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import UserAvatar from "./userAvatart";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Avatar, AvatarImage } from "../ui/avatar";
async function Header() {
  const user: IAuthData | null = await getAuthData();
  const t = await getTranslations("header");
  return (
    <section>
      <div className="md:hidden block">
        <MobileHeader t={t} user={user} />
      </div>
      <div className="md:block hidden">
        <DesktopHeader t={t} user={user} />
      </div>
    </section>
  );
}
/* 
-------------------------------------------------------------------------------
*/

const DesktopHeader = ({
  t,
  user,
}: {
  t: (txt: string) => string;
  user: IAuthData | null;
}) => (
  <header className="flex gap-5 justify-between w-full min-w-[500px] bg-[#F2F2F2] px-3 py-1 dark:bg-[#0D0D0D]  border-b border-border shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-background/80">
    <div className="flex items-center min-w-[9ch]">
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
      <Link className=" my-auto" href={"/write"}>
        <Button variant={"default"} className="max-h-9">
          {t("write")}
        </Button>
      </Link>
      <Separator orientation="vertical" />
      <nav className="flex gap-3 my-1">
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
          <UserAvatar username={user.username} img={user.img} id={user.id} />
        )}
      </nav>
    </div>
  </header>
);

const MobileHeader = ({
  t,
  user,
}: {
  t: (txt: string) => string;
  user: IAuthData | null;
}) => (
  <header className="flex gap-5 justify-between w-full  bg-[#F2F2F2] px-3 py-1 dark:bg-[#0D0D0D]  border-b border-border shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-background/80">
    <div className="flex items-center min-w-[9ch]">
      <Link href={{ pathname: "/" }}>
        <h1 className="font-bold text-xl">
          Write Any <br /> Sh*t
        </h1>
      </Link>
    </div>
    <div className="flex justify-center gap-6">
      <NavigationMenu>
        <NavigationMenuList className="flex gap-2 ">
          {!user ? (
            <>
              <NavigationMenuItem>
                <Button
                  variant={"default"}
                  className="max-h-9 bg-[#518C4F] hover:bg-[#518C4F]  hover:text-primary duration-150 "
                >
                  <Link href={{ pathname: "/sign-up" }}>
                    <NavigationMenuLink>{t("signUp")}</NavigationMenuLink>
                  </Link>
                </Button>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button
                  variant={"default"}
                  className="max-h-9 bg-[#F2CB58] hover:bg-[#F2CB58] hover:text-primary  duration-150"
                >
                  <Link href={{ pathname: "/sign-in" }}>
                    <NavigationMenuLink>{t("signIn")}</NavigationMenuLink>
                  </Link>
                </Button>
              </NavigationMenuItem>
            </>
          ) : (
            <>
              <NavigationMenuItem>
                <Link className="my-auto" href={"/write/new"}>
                  <Button variant={"default"} className="max-h-9">
                    {t("write")}
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Avatar>
                    <AvatarImage src={user.img} />
                  </Avatar>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="flex flex-col gap-5 py-3 px-2 items-center">
                  <div className=" items-center flex ">
                    <ThemeSelector />
                    <SelectLang />
                  </div>
                  <UserAvatar
                    username={user.username}
                    img={user.img}
                    id={user.id}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  </header>
);

export default Header;
