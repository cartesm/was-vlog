import { Link } from "@/i18n/routing";
import { Avatar } from "./ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { IAuthData } from "@/interfaces/authData.interface";
import { getAuthData } from "@/lib/getAuthData";
import SelectLang from "@/components/SelectLanguaje";
import ThemeSelector from "@/components/ThemeSelector";

async function Header({ locale }: { locale: string }) {
  const user: IAuthData | null = await getAuthData();
  return (
    <section>
      <header className="flex gap-5 items-center justify-between dark:bg-blue-500 bg-red-600">
        <h1>Write Any Sh*t</h1>
        <Link href={{ pathname: "/" }} locale="en">
          en
        </Link>
        <SelectLang />
        <ThemeSelector />
        <nav className="flex gap-4">
          {!user ? (
            <>
              <Link href={`${locale}/sign-in`}>Sign In</Link>
              <Link href={"/sign-up"}>Sign Up</Link>
            </>
          ) : (
            <Avatar>
              <AvatarImage src={""} />
              <AvatarFallback>asdiasjd</AvatarFallback>
            </Avatar>
          )}
        </nav>
      </header>
    </section>
  );
}

export default Header;
