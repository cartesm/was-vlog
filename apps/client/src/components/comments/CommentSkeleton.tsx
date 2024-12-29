import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

function CommentSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-3 w-[100px]" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%] mt-2" />
      </CardContent>
      <CardFooter className="flex justify-start gap-1 max-h-8">
        <Skeleton className="h-8 w-[70px] rounded-r-none" />
        <Skeleton className="h-8 w-[120px] rounded-l-none rounded-r-none" />
        <Skeleton className="h-8 w-[100px] rounded-l-none" />
      </CardFooter>
    </Card>
  );
}

export default CommentSkeleton;
