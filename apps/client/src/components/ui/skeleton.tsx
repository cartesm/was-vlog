import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted dark:bg-neutral-500 bg-neutral-300",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
