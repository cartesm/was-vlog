"use client";
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
import { Lock, User, Mail, UserPlus } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { emailPattern, passwordPattern } from "@/lib/utils/regex";
import { Link, useRouter } from "@/i18n/routing";
import { IReturnResponse, signUpRequest } from "@/lib/api/auth";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spiner";

interface IRegisterData {
  username: string;
  name: string;
  password: string;
  email: string;
}

export default function Component() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IRegisterData>();
  const t = useTranslations();
  const [authErrors, setAuthErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IRegisterData> = async (
    data: IRegisterData
  ): Promise<void> => {
    setLoading(true);
    const { error, message }: IReturnResponse = await signUpRequest({
      ...data,
      pass: data.password,
    });
    setLoading(false);
    if (error) {
      setAuthErrors(Array.isArray(message) ? message : [message]);
      const setTimeErrors = setTimeout(() => {
        setAuthErrors([]);
        return clearTimeout(setTimeErrors);
      }, 10000);
      return;
    }
    toast({ title: t("signUp.page"), description: message });
    const cookies = (await import("js-cookie")).default;
    const redirectTo: string | undefined = cookies.get("was_redirect_to");
    router.replace(redirectTo ? redirectTo : "/");
    cookies.remove("was_redirect_to");
    router.refresh();
  };

  return (
    <div className="flex items-center justify-center mx-auto w-full">
      <section className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center py-3">
              {t("signUp.page")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("signUp.label")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-2 max-w-[446px] mx-auto">
                <Label htmlFor="username">{t("auth.username")}</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("auth.placeholder.username")}
                    className="pl-10 w-full"
                    required
                    autoComplete="off"
                    {...register("username", {
                      required: true,
                      minLength: 5,
                      maxLength: 27,
                    })}
                  />
                </div>
                <div className=" inline ">
                  {errors.username?.type == "required" && (
                    <span className="error-message">
                      {t("auth.auth.usernameEmpty")}
                    </span>
                  )}
                  {errors.username?.type == "minLength" && (
                    <span className="error-message">
                      {t("auth.auth.usernameMin")}
                    </span>
                  )}
                  {errors.username?.type == "maxLength" && (
                    <span className="error-message">
                      {t("auth.auth.usernameMax")}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t("auth.name")}</Label>
                <div className="relative">
                  <UserPlus
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("auth.placeholder.name")}
                    className="pl-10"
                    required
                    autoComplete="off"
                    {...register("name", {
                      required: true,
                      minLength: 6,
                      maxLength: 60,
                    })}
                  />
                </div>
                <div className=" inline ">
                  {errors.name?.type == "required" && (
                    <span className="error-message">
                      {t("auth.auth.nameEmpty")}
                    </span>
                  )}
                  {errors.name?.type == "minLength" && (
                    <span className="error-message">
                      {t("auth.auth.nameMin")}
                    </span>
                  )}
                  {errors.name?.type == "maxLength" && (
                    <span className="error-message">
                      {t("auth.auth.nameMax")}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.placeholder.email")}
                    className="pl-10"
                    required
                    autoComplete="off"
                    {...register("email", {
                      required: true,
                      pattern: emailPattern,
                    })}
                  />
                </div>
                <div className=" inline ">
                  {errors.email?.type == "required" && (
                    <span className="error-message">
                      {t("auth.auth.emailEmpty")}
                    </span>
                  )}
                  {errors.email?.type == "pattern" && (
                    <span className="error-message">
                      {t("auth.auth.emailWrong")}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.pass")}</Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="password"
                    type="text"
                    placeholder={t("auth.placeholder.pass")}
                    className="pl-10"
                    required
                    autoComplete="off"
                    {...register("password", {
                      required: true,
                      minLength: 6,
                      pattern: passwordPattern,
                    })}
                  />
                </div>
                <div className=" inline ">
                  {errors.password?.type == "required" && (
                    <span className="error-message">
                      {t("auth.auth.passEmpty")}
                    </span>
                  )}
                  {errors.password?.type == "minLength" && (
                    <span className="error-message">
                      {t("auth.auth.passMin")}
                    </span>
                  )}
                  {errors.password?.type == "pattern" && (
                    <span className="error-message">
                      {t("auth.auth.passValidation")}
                    </span>
                  )}
                </div>
              </div>
              {loading && (
                <div className="flex items-center justify-center mx-auto">
                  <Spinner size={"medium"} />
                </div>
              )}
              <Button className="w-full" type="submit">
                {t("signUp.page")}
              </Button>
            </form>
            <div className="flex flex-col gap-1 py-2">
              {authErrors?.map((err, index) => (
                <span className="error-message" key={index}>
                  {`${index + 1}- ${err}`}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-600 w-full">
              {t("signUp.haveAccount") + " "}
              <Link
                href="/sign-in"
                className="font-medium text-blue-600 hover:underline"
              >
                {t("signUp.signIn")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
