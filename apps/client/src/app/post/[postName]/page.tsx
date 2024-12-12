import Viewer from "@/components/Posts/Viewer";
import { useEffect } from "react";

async function page({ params }: { params: Promise<{ postName: string }> }) {
  const { postName } = await params;

  useEffect;

  return (
    <section>
      <Viewer />
    </section>
  );
}

export default page;
