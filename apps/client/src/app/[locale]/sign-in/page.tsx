"use client";
import { Spinner } from "@/components/ui/spiner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Chrome } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useRouter } from "@/i18n/routing";
import { useToast } from "@/hooks/use-toast";
import { signInRequest } from "@/lib/api/auth";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { baseUrl } from "@/lib/configs";
import { emailPattern } from "@/lib/utils/regex";
import { IRespData } from "@/interfaces/errorDataResponse.interface";
import { useFetchErrors } from "@/hooks/useFetchErrors";
interface IInputs {
  email: string;
  password: string;
}

export default function Component() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const { errors: fetchErrors, removeAll, set: setErrors } = useFetchErrors();
  const [charging, setCharging] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IInputs>();

  const onSubmit: SubmitHandler<IInputs> = async (data: IInputs) => {
    setCharging(true);
    const { error, data: respData }: IRespData<string> = await signInRequest({
      ...data,
      pass: data.password,
    });
    setCharging(false);
    if (error) {
      setErrors(error);
      const setTimeError = setTimeout(() => {
        removeAll();
        return clearTimeout(setTimeError);
      }, 7000);
      return;
    }
    toast({ title: t("signIn.page"), description: respData });
    const cookies = (await import("js-cookie")).default;
    const redirectTo: string | undefined = cookies.get("was_redirect_to");
    router.replace(redirectTo ? redirectTo : "/");
    cookies.remove("was_redirect_to");
    router.refresh();
  };

  const signInWithGoogle = async (): Promise<void> => {
    router.push(baseUrl + "/auth/google");
  };

  return (
    <div className="flex items-center mx-auto max-w-full  justify-center">
      <section className="flex-grow flex items-center   justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center py-3">
              {t("signIn.page")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("signIn.label")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoFocus
                    className="w-full"
                    autoComplete="off"
                    placeholder={t("auth.placeholder.email")}
                    {...register("email", {
                      required: true,
                      pattern: emailPattern,
                    })}
                  />
                  {errors.email?.type == "required" && (
                    <span className="error-message space-y-1">
                      {t("auth.auth.emailEmpty")}
                    </span>
                  )}
                  {errors.email?.type == "pattern" && (
                    <span className="error-message space-y-1">
                      {t("auth.auth.emailWrong")}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">{t("auth.pass")}</Label>
                  <Input
                    autoComplete="off"
                    id="password"
                    type="password"
                    placeholder={t("auth.placeholder.pass")}
                    {...register("password", {
                      required: true,
                    })}
                  />
                  {errors.password?.type == "required" && (
                    <span className="error-message space-y-1">
                      {t("auth.auth.passEmpty")}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 py-2">
                  {fetchErrors?.map((err, index) => (
                    <span className="error-message" key={index}>
                      {err}
                    </span>
                  ))}
                </div>
                {charging && (
                  <div className="w-full flex items-center justify-center">
                    <Spinner size={"medium"} />
                  </div>
                )}
                <Button className="w-full " type="submit">
                  {t("signIn.page")}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-black  px-2 text-gray-500">
                  {t("auth.continueWith")}
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={signInWithGoogle}
                size={"icon"}
              >
                <Chrome className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-center text-sm text-gray-600">
              {t("signIn.notAccount") + " "}
              <Link
                href={"/sign-up"}
                className="font-medium text-blue-600 hover:underline"
              >
                {t("signIn.signUp")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
