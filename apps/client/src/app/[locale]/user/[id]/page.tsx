import UserCard from "@/components/User/UserCard";
import { Props } from "@/interfaces/seo.inmterface";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
const UserContent = dynamic(() => import("@/components/User/UserContent"));

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = (await params).id;
  // TODO: hacer el props dynamico
  //TODO: reparar el nomnre
  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json());

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.title,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
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
