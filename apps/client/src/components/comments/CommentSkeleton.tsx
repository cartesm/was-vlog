import { Skeleton } from "../ui/skeleton";

function CommentSkeleton() {
  return (
    <div className="flex space-x-4 p-4">
      <Skeleton className="h-12 w-12 rounded-full " />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center space-x-4 pt-2">
          <Skeleton className="h-4 w-[30px]" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      </div>
    </div>
  );
}

export default CommentSkeleton;
