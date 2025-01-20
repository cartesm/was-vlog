"use client";

import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export const validateIsLogedInClient = (): boolean => {
  const authToken: string | undefined = Cookies.get("was_auth_token");
  if (!authToken) {
    toast({
      title: "Sesion requerida",
      description: "Inicia seseion para popder dar un like",
    });
    return false;
  }
  return !false;
};
