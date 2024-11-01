import Link from "next/link";
import React from "react";

function Header() {
  return (
    <header>
      <h1>Write Any Sh*t</h1>
      <nav>
        <Link href={"/sign-in"}>Sign In</Link>
        <Link href={"/sign-up"}>Sign Up</Link>
      </nav>
    </header>
  );
}

export default Header;
