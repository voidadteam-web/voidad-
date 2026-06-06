import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

function getHostname(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  return host.split(":")[0]?.toLowerCase() ?? "";
}

export async function middleware(request: NextRequest) {
  const hostname = getHostname(request);

  if (hostname === "voidad.de" || hostname === "www.voidad.de") {
    const { pathname } = request.nextUrl;

    if (pathname === "/" || pathname === "") {
      const url = request.nextUrl.clone();
      url.pathname = "/de";
      return NextResponse.redirect(url);
    }

    if (!pathname.startsWith("/de") && !pathname.startsWith("/en")) {
      const url = request.nextUrl.clone();
      url.pathname = `/de${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
