"use client";

import { useEffect, useState } from "react";
import { format } from "@formkit/tempo";
import { IUser } from "@/interfaces/user.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { getLogedUser } from "@/lib/api/user";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import UserCardSkeleton from "./Skeleton";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CalendarDays, Edit, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { follow } from "@/lib/api/followers";
import { toast } from "@/hooks/use-toast";
import { validateIsLogedInClient } from "@/lib/validateIsLogedClient";

function UserCard({
  id,
  locale,
  isLogedUser,
}: {
  id: string;
  locale: string;
  isLogedUser?: boolean;
}) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [attemps, setAttemps] = useState<number>(0);

  const refreshComponent = () => setAttemps(attemps + 1);
  const { set: setErrors } = useFetchErrors();
  const fetchUserData = async () => {
    const { data, error }: IRespData<IUser> = await getLogedUser(id);
    if (error) {
      setErrors(error);
      return;
    }
    setUser(data);
  };

  const followAuser = async (otherUserId: string, username: string) => {
    console.log("first");
    const isLoged: boolean = validateIsLogedInClient();
    if (!isLoged) return;
    const resp: IRespData<string> = await follow(otherUserId);
    if (resp.error) {
      toast({
        title: "Follow status",
        description: resp.error,
        variant: "destructive",
      });
      return;
    }
    setUser((actual) => ({ ...actual, follow: true }) as IUser);
    toast({
      title: "Follow status",
      description: `Ahora sigues a ${username}`,
    });
  };

  useEffect(() => {
    fetchUserData();
  }, [id, attemps]);
  if (!user) return <UserCardSkeleton refreshComponent={refreshComponent} />;
  //TODO: crear esqueleto
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col md:flex-row items-center gap-4">
        <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
          <AvatarImage src={user.img} alt={user.username || "User"} />
          <AvatarFallback>
            {user.username ? user.username.slice(0, 2).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center sm:items-start mt-4 sm:mt-0">
          <h2 className="text-2xl font-bold text-center sm:text-left">
            {user.username}
          </h2>
          <p className="text-sm text-muted-foreground text-center sm:text-left mt-2">
            {user.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="flex flex-col  justify-center items-center md:items-start gap-2 ">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{user.followerCount} seguidores</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>Se unió el {format(user.createdAt, "medium", locale)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center md:justify-normal">
        {String(user.follow)}
        {!isLogedUser && (
          <Button
            variant={user.follow ? "outline" : "default"}
            onClick={
              !user.follow
                ? () => followAuser(user._id, user.username)
                : () => {}
            }
          >
            {user.follow ? "Dejar de seguir" : "Seguir"}
          </Button>
        )}
        {isLogedUser && (
          <Button>
            <Link href={`/profile/${user._id}/edit`}>
              <Edit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default UserCard;
