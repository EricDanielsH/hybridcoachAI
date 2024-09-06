import { NextResponse } from "next/server";
import { auth } from "@/auth";

const publicRoutes = ["/", "/login", "/register", "/plans"];
const authRoutes = ["/login", "/register"];
const apiAuthPrefix = "/api/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const hasAccess = req.auth?.user?.hasAccess;

  console.log({ isLoggedIn, path: nextUrl.pathname });

  // Skip authentication for Stripe webhook
  if (nextUrl.pathname === "/api/webhook/stripe") {
    console.log("Skipping auth for Stripe webhook")
    return NextResponse.next();
  }

  // Allow all authentication-related API routes
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next();
  }

  // Allow access to public routes regardless of authentication state
  if (publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect to /dashboard if the user is logged in and trying to access authentication routes
  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // If user doesnt have access, redirect to pricing page to pay
  if (isLoggedIn && !hasAccess && !publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/plans", nextUrl));
  }

  // Redirect to /login if the user is not logged in and tries to access a protected route
  if (
    !isLoggedIn &&
    !authRoutes.includes(nextUrl.pathname) &&
    !publicRoutes.includes(nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
