import UserCard from "@/components/User/UserCard";
import { IErrorResp } from "@/interfaces/errorDataResponse.interface";
import { Props } from "@/interfaces/props.interface";
import { ISubUser } from "@/interfaces/user.interface";
import { baseUrl } from "@/lib/configs";
import { getLocaleToken } from "@/lib/getLocaleCookie";
import { Metadata } from "next";
import dynamic from "next/dynamic";
const UserContent = dynamic(() => import("@/components/User/UserContent"));
//TODO: traducir el componente de escribir

export async function generateMetadata({
  params,
}: Props<{ id: string }>): Promise<Metadata> {
  const id = (await params).id;
  const locale: string | undefined = await getLocaleToken();
  const userData: IErrorResp & ISubUser = await fetch(
    `${baseUrl}/users/metadata/${id}`,
    {
      ...(locale && {
        headers: {
          "Accept-Language": locale,
        },
      }),
    }
  ).then((res) => res.json());
  if (userData.statusCode == 404 || 406)
    return {
      title: `${userData.statusCode} | ${userData.error}`,
      description: userData.message,
    };
  return {
    title: `${userData.statusCode} | ${userData.error}`,
    ...(userData.description && { description: userData.description }),
    openGraph: {
      title: `WAS | ${userData.username}`,
      ...(userData.description && { description: userData.description }),
      images: [userData.img],
      //locale: "",
      type: "profile",
    },
    authors: [
      {
        name: userData.username,
        url: `http://localhost:3000/user/${userData._id}`,
      },
    ],
  };
}

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale }: { id: string; locale: string } = await params;

  return (
    <section className="container mx-auto p-4">
      <div className="flex  flex-wrap flex-col gap-4">
        <UserCard isLogedUser={false} id={id} locale={locale} />
        <UserContent userId={id} />
      </div>
    </section>
  );
}
