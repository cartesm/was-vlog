"use server";
import { IAuthData } from "@/interfaces/authData.interface";
import { getAuthData, getAuthToken } from "@/lib/getAuthData";
import { redirect } from "@/i18n/routing";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IUser } from "@/interfaces/user.interface";
import { baseUrl } from "@/lib/configs";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";

const ErrorComponent = dynamic(() => import("@/components/ErrorComponent"));
const EditUserForm = dynamic(() => import("@/components/User/EditUserForm"));
const fetchUserData = async (id: string): Promise<IRespData<IUser>> => {
  try {
    const resp: Response = await fetch(`${baseUrl}/users/private/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });
    const data = await resp.json();
    return { data };
  } catch (e: any) {
    return {
      error: Array.isArray(e.response.data.message)
        ? e.response.data.message
        : [e.response.data.message],
    };
  }
};

export default async function page({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const t = await getTranslations();
  const { id, locale }: { id: string; locale: string } = await params;
  const user: IAuthData | null = await getAuthData();
  if (user?.id != id) redirect({ href: "/", locale });

  const { data, error } = await fetchUserData(id);

  if (error) return <ErrorComponent error={error} status={500} />;

  return (
    <div className="max-w-5xl mx-auto flex items-center p-6 bg-secondary justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-5 text-center">
          {t("user.edite")}
        </h1>
        {user && <EditUserForm user={data as IUser} />}
      </div>
    </div>
  );
}
