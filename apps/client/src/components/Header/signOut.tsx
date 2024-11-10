"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import cookies from "js-cookie";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
function SignOut() {
  const router = useRouter();
  const t = useTranslations();
  const signOut = () => {
    cookies.remove("was_auth_token");
    toast({ title: t("signIn.page"), description: t("auth.signOut") });
    router.refresh();
  };
  return (
    <Button variant={"outline"} onClick={signOut}>
      <LogOut />
    </Button>
  );
}

export default SignOut;
