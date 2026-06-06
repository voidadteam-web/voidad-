import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const handleI18nRouting = createMiddleware(routing);

function getHostname(request: NextRequest) {
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  return host.split(":")[0]?.toLowerCase() ?? "";
}

function redirectToGermanLocale(request: NextRequest) {
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

  return null;
}

export async function proxy(request: NextRequest) {
  const hostname = getHostname(request);

  if (hostname === "voidad.de" || hostname === "www.voidad.de") {
    const germanRedirect = redirectToGermanLocale(request);
    if (germanRedirect) {
      return updateSession(request, germanRedirect);
    }
  }

  const response = handleI18nRouting(request);
  return updateSession(request, response);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
