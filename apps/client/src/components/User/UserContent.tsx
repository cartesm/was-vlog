"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getUserPosts,
  IPostContent,
  IPostPagination,
  IRespPagination,
} from "@/lib/api/posts";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
function UserContent({
  userId,
  page,
}: {
  userId: string;
  page: number;
}): React.ReactElement {
  const [posts, setPosts] = useState<IPostPagination>();
  const [order, setOrder] = useState<number | -1 | 1>(1);

  useEffect(() => {
    getUserPosts(userId, page, order)
      .then((data: IRespPagination) => setPosts(data.data))
      .catch((e: IRespPagination) => console.log(e.errors));
  }, [page, order, userId]);

  // TODO: testear componentes del user y los post con errores a proposito

  return (
    <div className="grid grid-cols-1 gap-4">
      <Select
        defaultValue={order.toString()}
        onValueChange={(nValue: string) => setOrder(Number(nValue))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Ordenar por</SelectLabel>
            <SelectItem value="1">Mas Nuevo</SelectItem>
            <SelectItem value="-1">Mas antiguo</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <h2 className="text-2xl font-bold mb-4">Contenido del usuario</h2>
      <span className="text-sm"> Total Posts: {posts?.totalDocs}</span>
      {posts ? (
        posts.docs.map((post: IPostContent, index: number) => (
          <Card key={post._id} className="">
            <CardHeader>
              <CardTitle>{post.name}</CardTitle>
              <CardDescription>
                {new Date(post.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-start gap-2">
                <Badge variant="secondary">{post.likeCount} likes</Badge>
                {post.tags.map((tag: { name: string; _id: string }) => (
                  <Badge key={tag._id} variant={"outline"}>
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <>
          <SkeletonPost />
          <SkeletonPost />
        </>
      )}
    </div>
  );
}

const SkeletonPost: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[300px]" />
        <CardDescription>
          <Skeleton className="h-6 w-[180px]" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-start gap-2">
          <Skeleton className="h-3 w-[50px]" />
          <Skeleton className="h-3 w-[50px]" />
          <Skeleton className="h-3 w-[50px]" />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserContent;
