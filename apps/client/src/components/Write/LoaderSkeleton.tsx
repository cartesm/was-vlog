import { Skeleton } from "../ui/skeleton";

function LoaderSkeleton() {
  return (
    <section className="p-2 mx-auto flex flex-col justify-between w-full">
      <div className="flex gap-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="w-8 h-8 p-5 rounded-md" />
        ))}
      </div>
      <div className="flex flex-col-reverse lg:flex-row  overflow-hidden gap-4 py-5">
        <Skeleton className="flex-1 py-6 w-full  h-full min-h-[500px] mt-6"></Skeleton>
        <Skeleton className="w-full lg:w-1/3 min-h-[250px] rounded-md bg-blue-500 p-2 bg-secondary"></Skeleton>
      </div>
    </section>
  );
}

export default LoaderSkeleton;
