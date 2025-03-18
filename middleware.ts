import NextAuth from "next-auth";
import authConfig from "./lib/auth.config";
import { apiAuthPrefix, authRoutes, DEFAULT_REDIRECT_AFTER_LOGIN, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  
  const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(req.nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(req.nextUrl.pathname);

  if(isApiAuthRoute) {
    return;
  }

  if(isAuthRoute) {
    if(isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT_AFTER_LOGIN, req.nextUrl))
    }
    return;
  }

  if(!isLoggedIn && !isPublicRoutes) {
    return Response.redirect(new URL("/login", req.nextUrl))
  }
  return;
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}