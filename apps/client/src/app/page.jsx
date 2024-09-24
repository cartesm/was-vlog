import Link from "next/link";
import React from "react";
function page() {
  return (
    <div className="flex flex-col">
      default
      <Link href={"/protected"}>protected</Link>
      <Link href={"http://localhost:3000/auth/google"}>auth</Link>
      
    </div>
  );
}

export default page;
