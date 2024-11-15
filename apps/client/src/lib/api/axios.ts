"use client";
import cookies from "js-cookie";
import axios, { Axios, InternalAxiosRequestConfig } from "axios";
import { baseUrl as baseURL } from "@/lib/configs";
import { locales } from "@/i18n/routing";
const AxiosInstance: Axios = axios.create({
  baseURL,
  withCredentials: true,
});

AxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authToken: string | undefined = cookies.get("was_auth_token");
    const locale: string | undefined = cookies.get("NEXT_LOCALE");

    if (authToken && config.headers) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    const isValidLocale: boolean = locales.some((lang) => lang === locale);
    config.headers["Accept-Language"] = isValidLocale ? locale || "es" : "es";
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
