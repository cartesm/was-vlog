import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header/Header";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write any sh*t",
  description:
    "Un espacio para explorar pensamientos, ideas, y palabras sin restricciones. Desde reflexiones profundas hasta escritos casuales, este es un vlog para escribir cualquier cosa.",
  openGraph: {
    title: "Write any sh*t",
    description:
      "Sumérgete en un mundo donde la escritura no tiene reglas. Inspírate con reflexiones, historias, y palabras al azar en este vlog sobre escribir cualquier cosa.",
  },
  icons: {
    icon: "https://res.cloudinary.com/dxljmfwff/image/upload/v1738100587/was_logo_lvldts.jpg",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-[#EAE8E7] dark:bg-[#3A3A38]">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            defaultTheme="light"
            attribute="class"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <Header />
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
