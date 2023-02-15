import { NextCookies } from "next/dist/server/web/spec-extension/cookies";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./utils/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token");

  const result = await verifyAuth(token).catch((e) => console.log(e));

  const verifiedToken = token && result;
  if (req.nextUrl.pathname.startsWith("/login") && !verifiedToken) {
    return;
  }

  if (req.url.includes("/login") && verifiedToken) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!verifiedToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/home", "/login", "/project/:projectId*"],
};
