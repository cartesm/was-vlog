"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOut from "./signOut";
import { useRouter } from "@/i18n/routing";

function UserAvatart({
  username,
  img,
  id,
}: {
  username: string;
  img: string;
  id: string;
}) {
  const router = useRouter();
  const handleClick = (): void => {
    router.replace(`/profile/${id}`);
    router.refresh();
  };
  return (
    <div
      className="flex items-center gap-4 md:flex-row flex-col  "
      onClick={handleClick}
    >
      <Avatar>
        <AvatarImage alt={username} src={img} />
        <AvatarFallback>{username}</AvatarFallback>
      </Avatar>
      <SignOut />
    </div>
  );
}

export default UserAvatart;
