"use client";

import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export const validateIsLogedInClient = (
  title: string,
  description: string
): boolean => {
  const authToken: string | undefined = Cookies.get("was_auth_token");
  if (!authToken) {
    toast({
      title,
      description,
    });
    return false;
  }
  return !false;
};
