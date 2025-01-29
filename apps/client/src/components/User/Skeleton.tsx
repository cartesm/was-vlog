"use client";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

function UserCardSkeleton() {
  const { errors } = useFetchErrors();
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-col md:flex-row items-center gap-4">
        <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
        <div className="flex flex-col items-center md:items-start mt-4 sm:mt-0 w-full sm:w-auto">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-full sm:w-64" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="flex flex-col  justify-center items-center md:items-start gap-2 ">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full sm:w-40 md:mx-0 mx-auto" />
      </CardFooter>
      {errors.length > 0 && (
        <>
          <div className="flex flex-col gap-1 items-center">
            {errors.map((err, index) => (
              <span className="error-message" key={index}>
                {err}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

export default UserCardSkeleton;
