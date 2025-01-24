"use client";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

function ErrorComponent({
  error,
  status,
}: {
  error: string[];
  status: number;
}) {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center max-h-[100vh] h-full  p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Image
            src={`https://http.cat/images/${status}.jpg`}
            alt="Error illustration"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          {t("error")}
        </h2>
        <ul className="space-y-2">
          {error.map((error, index) => (
            <li key={index} className="flex items-start text-gray-700">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ErrorComponent;
