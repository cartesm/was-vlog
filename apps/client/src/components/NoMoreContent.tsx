import { XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

function NoMoreContent({ message }: { message: string }) {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <XCircle className="w-12 h-12 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">{t("end")}</h2>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

export default NoMoreContent;
