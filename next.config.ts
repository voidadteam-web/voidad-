import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nehewgoinyxxjzjitpea.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "(www\\.)?voidad\\.de" }],
          destination: "/de",
        },
        {
          source: "/:path((?!de|en|_next|api).*)",
          has: [{ type: "host", value: "(www\\.)?voidad\\.de" }],
          destination: "/de/:path",
        },
        {
          source: "/",
          destination: "/en",
        },
        {
          source: "/:path((?!de|en|_next|api).*)",
          destination: "/en/:path",
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
