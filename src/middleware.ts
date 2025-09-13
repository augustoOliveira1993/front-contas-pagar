import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { generateDynamicRoutes, ONLY_AUTH_ROUTES } from "./lib/utils";
import { getSession, getUser, getTokenPayload } from "./lib/session/server";

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};

const publicRoutes = ["/", "/login", "/unauthorized"];

const excludedExtensions =
  /\.(png|jpg|jpeg|gif|svg|webp|ico|ttf|woff|woff2|eot|otf|css|js|map|json)$/;

const dynamicPublicRoutes = generateDynamicRoutes([]);

interface IAuthUser {
  _id: string | null;
  isAdmin: boolean;
  ability: string[] | null;
}

export default async function middleware(request: NextRequest) {
  "use server";

  const user: IAuthUser | null = await getUser();

  const url = request.nextUrl.pathname;

  if (
    url.startsWith("/api") ||
    url.startsWith("/_next/static") ||
    url.startsWith("/_next/image") ||
    url === "/favicon.ico" ||
    url === "/sitemap.xml" ||
    url === "/robots.txt" ||
    url === "/unauthorized" ||
    excludedExtensions.test(url)
  ) {
    return NextResponse.next();
  }

  const token = await getTokenPayload(request);
  const session = await getSession();

  const routerName: string = request.nextUrl.pathname;

  const baseURL =
    process.env.APP_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEV_API_BASE_URL
      : process.env.NEXT_PUBLIC_PROD_API_BASE_URL;

  if (process.env.APP_ENV !== "production") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  let userAuth: IAuthUser | null = {
    _id: user?._id || null,
    isAdmin: user?.isAdmin || false,
    ability: null,
  };

  if (token) {
    try {
      const response = await axios.get(`/auth/abilities`, {
        baseURL,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "x-access-token": token,
        },
      });
      userAuth = response.data;
    } catch (error: any) {}
  }

  if (userAuth?.isAdmin) {
    return NextResponse.next();
  }

  const isPublicRoute =
    publicRoutes.includes(routerName) ||
    dynamicPublicRoutes.some((route) => routerName.match(route.regex));

  if (routerName.includes("/login") && token) {
    const urlNext = request.nextUrl.clone();
    urlNext.pathname = "/";
    return NextResponse.redirect(urlNext);
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (routerName.startsWith("/auth") || routerName === "/") {
    return NextResponse.next();
  }

  if (!token || !session) {
    const urlNext = request.nextUrl.clone();
    urlNext.pathname = "/login";
    return NextResponse.redirect(urlNext);
  }

  if (ONLY_AUTH_ROUTES.includes(routerName)) {
    return NextResponse.next();
  }

  const routerPermission = `${routerName.split("/")[1]}_ver`;

  if (
    userAuth !== null &&
    !userAuth?.ability?.some((ab) => ab.includes(routerPermission))
  ) {
    const urlNext = request.nextUrl.clone();
    urlNext.pathname = "/unauthorized";
    return NextResponse.redirect(urlNext);
  }

  return NextResponse.next();
}
