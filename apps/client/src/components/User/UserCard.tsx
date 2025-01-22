"use client";

import { useCallback, useEffect, useState } from "react";
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
import { follow, unFollow } from "@/lib/api/followers";
import { toast } from "@/hooks/use-toast";
import { validateIsLogedInClient } from "@/lib/validateIsLogedClient";
import { DebouncedFuncLeading, throttle } from "lodash";

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

  const manageFollow = async (otherUserId: string) => {
    const isLoged: boolean = validateIsLogedInClient();
    if (!isLoged) return;
    if (!user) return;
    const resp: IRespData<string> = await (user.follow
      ? unFollow(otherUserId)
      : follow(otherUserId));
    if (resp.error) {
      toast({
        title: "Follow status",
        description: resp.error,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Follow status",
      description: resp.data ? resp.data : "Ya no sigues a fulanito",
    });
    setUser((actual) => ({ ...actual, follow: !actual?.follow }) as IUser);
  };
  const onFollowThrottle: DebouncedFuncLeading<(otherUserId: string) => void> =
    useCallback(
      throttle((otherUserId: string) => manageFollow(otherUserId), 1000),
      [manageFollow]
    );

  useEffect(() => {
    fetchUserData();
  }, [id, attemps]);
  if (!user) return <UserCardSkeleton refreshComponent={refreshComponent} />;

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
            <Link
              href={(window.location.href + "/followers").replace(
                "profile",
                "user"
              )}
            >
              <span className="hover:underline">
                {user.followerCount + " "} seguidores
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>Se unió el {format(user.createdAt, "medium", locale)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center md:justify-normal">
        {!isLogedUser && (
          <Button
            variant={user.follow ? "outline" : "default"}
            onClick={() => onFollowThrottle(user._id)}
          >
            {user.follow ? "Dejar de seguir" : "Seguir"}
          </Button>
        )}
        {isLogedUser && (
          <Link href={`/profile/${user._id}/edit`}>
            <Button>
              <Edit />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

export default UserCard;
