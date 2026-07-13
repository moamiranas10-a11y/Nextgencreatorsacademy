import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Route-level Role-Based Access Control.
// - /admin/**      -> SUPER_ADMIN only
// - /dashboard/**  -> any authenticated user (STUDENT or SUPER_ADMIN)
// - everything else is public.
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (pathname.startsWith("/admin")) {
      if (!token || token.role !== "SUPER_ADMIN") {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (pathname.startsWith("/dashboard")) {
      if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Always run the middleware function above; it decides access itself.
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
