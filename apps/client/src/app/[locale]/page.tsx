"user server";
import dynamic from "next/dynamic";
export default dynamic(() => import("@/components/Home/Search"), {
  loading: () => <div>cargando...</div>,
});
