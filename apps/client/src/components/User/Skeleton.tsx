"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function UserCardSkeleton({
  refreshComponent,
}: {
  refreshComponent: () => void;
}) {
  const { errors } = useFetchErrors();
  return (
    <Card className="">
      <CardContent className="flex flex-col gap-3 items-center p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
        <div className="flex gap-1 flex-col">
          <p>
            <Skeleton className="h-4 w-6 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </p>
          <p>
            <Skeleton className="h-4 w-20 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-col gap-2">
        <Skeleton className="h-8  w-full" />
        <Skeleton className="h-4 w-12" />
        {errors && (
          <>
            <div className="flex flex-col gap-1 items-center justify-center">
              {errors.map((err, index) => (
                <span className="error-message" key={index}>
                  {err}
                </span>
              ))}
            </div>
            <Button variant={"destructive"} onClick={refreshComponent}>
              Reload
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

export default UserCardSkeleton;
