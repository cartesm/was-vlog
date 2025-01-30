import { Search } from "lucide-react";
import React from "react";

function NotFound({
  message = "No se encontraron resultados",
  query,
  t,
}: {
  message?: string;
  query?: string;
  t: (value: string) => string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Search className="h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        {t("posts.no_results")} {query && ` para "${query}"`}
      </h2>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

export default NotFound;
