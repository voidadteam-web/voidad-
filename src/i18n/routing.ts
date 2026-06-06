import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  domains: [
    {
      domain: "voidad.com",
      defaultLocale: "en",
      locales: ["en"],
    },
    {
      domain: "www.voidad.com",
      defaultLocale: "en",
      locales: ["en"],
    },
    {
      domain: "voidad.de",
      defaultLocale: "de",
      locales: ["de"],
    },
    {
      domain: "www.voidad.de",
      defaultLocale: "de",
      locales: ["de"],
    },
  ],
});

export type Locale = (typeof routing.locales)[number];
