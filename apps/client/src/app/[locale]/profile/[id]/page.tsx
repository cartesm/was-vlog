import { IAuthData } from "@/interfaces/authData.interface";
import { getAuthData } from "@/lib/getAuthData";
import { redirect } from "@/i18n/routing";
import UserCard from "@/components/User/UserCard";
import UserContent from "@/components/User/UserContent";
export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale }: { id: string; locale: string } = await params;
  const user: IAuthData | null = await getAuthData();
  if (user?.id != id) redirect({ href: "/", locale });

  return (
    <section className="container mx-auto p-4">
      <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <UserCard id={id} locale={locale} />
        </div>
        <div className="col-span-1 md:col-span-2 ">
          <UserContent userId={id} />
        </div>
      </div>
    </section>
  );
}
