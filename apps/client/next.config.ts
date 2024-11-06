import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntlPlugin = createNextIntlPlugin("./src/i18n/request.ts");
const nextConfig: NextConfig = {};

export default withNextIntlPlugin(nextConfig);
