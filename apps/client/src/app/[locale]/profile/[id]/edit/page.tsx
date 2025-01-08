"use server";
import { IAuthData } from "@/interfaces/authData.interface";
import { getAuthData, getAuthToken } from "@/lib/getAuthData";
import { redirect } from "@/i18n/routing";
import { EditUserForm } from "@/components/User/EditUserForm";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IUser } from "@/interfaces/user.interface";
import { baseUrl } from "@/lib/configs";

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
  const { id, locale }: { id: string; locale: string } = await params;
  const user: IAuthData | null = await getAuthData();
  if (user?.id != id) redirect({ href: "/", locale });

  const { data, error } = await fetchUserData(id);

  if (error) return <div>error</div>;

  return (
    <div className="max-w-5xl mx-auto flex items-center p-6 bg-secondary justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-5 text-center">
          Editar Perfil de Usuario
        </h1>
        <EditUserForm user={data as IUser} />
      </div>
    </div>
  );
}
