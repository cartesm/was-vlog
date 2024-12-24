"use client";

import { useEffect, useState } from "react";
import { format } from "@formkit/tempo";
import { IUser } from "@/interfaces/user.interface";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { getLogedUser } from "@/lib/api/user";
import { Card, CardContent, CardFooter } from "../ui/card";
import UserCardSkeleton from "./Skeleton";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function UserCard({ id, locale }: { id: string; locale: string }) {
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

  useEffect(() => {
    fetchUserData();
  }, [id, attemps]);
  if (!user) return <UserCardSkeleton refreshComponent={refreshComponent} />;

  return (
    <Card className="">
      <CardContent className="flex flex-col gap-3 items-center p-4">
        <div className="flex items-center ">
          <Avatar className="w-[150px] h-[150px]">
            <AvatarImage alt={user.username} src={user.img} />
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="flex items-center flex-col">
            <span>{user.followerCount}</span>
            <span>Seguidores</span>
          </p>
          <div className="grid grid-cols-1 place-items-center">
            <span className="text-lg">{user.name}</span>
            <i className="text-sm">#{user.username}</i>
          </div>
          <p className="my-2">{user.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex max-w-md items-center mx-auto w-full flex-col gap-2">
        {user.follow ? (
          <Button className=" w-full max-h-8" variant={"destructive"}>
            Sejar de seguir
          </Button>
        ) : (
          <Button className="  w-full max-h-8" variant={"default"}>
            Seguir
          </Button>
        )}
        <span className="text-xs">
          Se unió el {format(user.createdAt, "medium", locale)}
        </span>
      </CardFooter>
    </Card>
  );
}

export default UserCard;
