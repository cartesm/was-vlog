import { IAuthData } from "@/interfaces/authData.interface";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
export const getAuthData = async (): Promise<null | IAuthData> => {
  try {
    const authCookie: string | undefined = (await cookies()).get(
      "was_auth_token"
    )?.value;
    if (!authCookie) return null;
    const decodedData: IAuthData = jwtDecode(authCookie);
    return decodedData;
  } catch (err: unknown) {
    return null;
  }
};

export const getAuthToken = async (): Promise<undefined | string> => {
  return (await cookies()).get("was_auth_token")?.value;
};
