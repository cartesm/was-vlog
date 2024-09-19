"use client";

import { useCookies } from "next-client-cookies";

function Page() {
  const cookies = useCookies();
  const handleClick = () => {
    cookies.set("redirect-url", window.location.href);
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div>
      <button onClick={handleClick}>Login</button>
    </div>
  );
}
export default Page;
