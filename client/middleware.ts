import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define which paths are protected and need authentication
  const isAdminPath = path.startsWith("/admin");

  // Get the user from localStorage (client-side only, this is just for route protection)
  const user = request.cookies.get("termly_user")?.value
    ? JSON.parse(request.cookies.get("termly_user")?.value || "{}")
    : null;

  console.log(user);

  // If trying to access admin path but not logged in or not an admin
  // if (isAdminPath && (!user || user.role !== "ADMIN")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*"],
};
