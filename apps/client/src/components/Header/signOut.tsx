"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import cookies from "js-cookie";
import { LogOut } from "lucide-react";
function SignOut() {
  const router = useRouter();
  const signOut = () => {
    cookies.remove("was_auth_token");
    router.refresh();
  };

  return (
    <Button variant={"outline"} onClick={signOut}>
      <LogOut />
    </Button>
  );
}

export default SignOut;
