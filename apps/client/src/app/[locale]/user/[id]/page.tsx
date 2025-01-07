import UserCard from "@/components/User/UserCard";
import dynamic from "next/dynamic";
const UserContent = dynamic(() => import("@/components/User/UserContent"));
export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale }: { id: string; locale: string } = await params;

  return (
    <section className="container mx-auto p-4">
      <div className="flex  flex-wrap flex-col gap-4">
        <UserCard id={id} locale={locale} />
        <UserContent userId={id} />
      </div>
    </section>
  );
}
