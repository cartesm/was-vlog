"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spiner";
import { useFetchErrors } from "@/hooks/useFetchErrors";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { IFollowers } from "@/interfaces/followers.interface";
import { IPaginationData } from "@/interfaces/pagination.interface";
import { getFollowersOf } from "@/lib/api/followers";
import { format } from "@formkit/tempo";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

function Page() {
  const t = useTranslations();
  const { id: userId, lang } = useParams();
  const [followers, setFollowers] = useState<IFollowers[]>([]);
  const [page, setPage] = useState<number>(1);
  const [haveMorePage, setHaveMorePage] = useState<boolean>(true);

  const { errors, removeAll, set: setErrors } = useFetchErrors();

  const fetchFollowers = async () => {
    const resp: IRespData<IPaginationData<IFollowers>> = await getFollowersOf({
      page,
      user: userId as string,
    });
    if (resp.error) {
      setErrors(resp.error);
      return;
    }
    setPage(resp.data?.page as number);
    setHaveMorePage(resp.data?.hasNextPage as boolean);
    setFollowers(resp.data?.docs as IFollowers[]);
  };

  useEffect(() => {
    fetchFollowers();
  }, []);
  // TODO: hacer que el followers funcione aqui, modularizando
  // TODO: hacer que el nombre redirija
  // TODO: reutilizar este componente para el perfil del usuario y poder eliminar seguidores
  // TODO: validar que no se borre un seguirdor de otra persona
  return (
    <section>
      <div className="border-2 flex flex-col gap-3 bg-secondary max-w-2xl mx-auto p-3 ">
        <h3 className="w-full text-start text-xl font-semibold">
          Seguidores de
        </h3>

        {followers.length < 0 ? (
          <div className="mx-auto flex items-center justify-center overflow-hidden p-4">
            <Spinner size={"medium"} />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={followers.length}
            next={fetchFollowers}
            hasMore={haveMorePage}
            loader={
              <div className="mx-auto flex items-center justify-center overflow-hidden p-4">
                <Spinner size={"medium"} />
              </div>
            }
            endMessage={
              <span className="mx-auto text-center font-semibold text-lg py-12 block">
                {t("user.posts.endOfContent")}
              </span>
            }
          >
            {followers?.map((follower, index) => (
              <Card
                key={index}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center w-full p-6 gap-4">
                  <Avatar>
                    <AvatarImage
                      src={follower.follower.img}
                      alt={follower.follower.username}
                    />
                    <AvatarFallback>
                      {follower.follower.username}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{follower.follower.username}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Desde el
                      {format(follower.createdAt, "medium", lang as string)}
                    </p>
                  </div>
                </div>
                <CardContent className="flex  justify-end mt-auto pb-6">
                  <Button>Ver Perfil</Button>
                </CardContent>
              </Card>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </section>
  );
}

export default Page;
