"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOut from "./signOut";
import { Link } from "@/i18n/routing";

function UserAvatart({
  username,
  img,
  id,
}: {
  username: string;
  img: string;
  id: string;
}) {
  return (
    <Link
      href={`/profile/${id}`}
      className="flex items-center gap-4 md:flex-row flex-col  "
    >
      <Avatar>
        <AvatarImage alt={username} src={img} />
        <AvatarFallback>{username}</AvatarFallback>
      </Avatar>
      <SignOut />
    </Link>
  );
}

export default UserAvatart;
