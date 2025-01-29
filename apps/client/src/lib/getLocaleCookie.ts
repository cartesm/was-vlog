import { cookies } from "next/headers";

export const getLocaleToken = async (): Promise<undefined | string> => {
  return (await cookies()).get("NEXT_LOCALE")?.value;
};
