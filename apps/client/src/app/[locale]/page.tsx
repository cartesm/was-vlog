"user server";
import dynamic from "next/dynamic";
import SearchSekeleton from "@/components/Home/SearchSkeleton";
export default dynamic(() => import("@/components/Home/Search"), {
  loading: () => <SearchSekeleton />,
});
