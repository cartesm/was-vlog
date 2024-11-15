"use client";

import { format } from "@formkit/tempo";
import { getLogedUser, IErrorResp, IUser, IUserResp } from "@/lib/api/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CardContent,
  CardTitle,
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

function UserCard({ id, locale }: { id: string; locale: string }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [errors, setErrors] = useState<string | string[] | null>(null);
  const [attemps, setAttemps] = useState<number>(0);
  const refrashComponent = () => setAttemps(attemps + 1);
  useEffect(() => {
    getLogedUser(id).then((data: IUserResp) => {
      if (data.errors) {
        setErrors(data.errors.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: data.errors.message,
        });
        return;
      }
      setErrors(null);
      setUser(data.user ? data.user : null);
    });
  }, [id, attemps]);
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user?.img} alt={user?.username} />
            <AvatarFallback>{user?.username}</AvatarFallback>
          </Avatar>
          <div>
            {!user ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-5 w-[150px]" />
              </div>
            ) : (
              <>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.username}</CardDescription>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{user?.description}</p>
        <div className="flex items-center gap-3">
          {!user ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-[250px]" />
              <Skeleton className="h-5 w-[140px]" />
            </div>
          ) : (
            <>
              <span className="text-xs">
                Se unió el {format(user.createdAt, "medium", locale)}
              </span>
            </>
          )}
        </div>
        {errors && (
          <Button
            onClick={refrashComponent}
            className="mt-5"
            variant={"destructive"}
          >
            Try gain
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default UserCard;
