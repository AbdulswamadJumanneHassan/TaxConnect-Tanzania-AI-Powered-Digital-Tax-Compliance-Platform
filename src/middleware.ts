import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

// Add paths that should be protected
const protectedRoutes = ["/dashboard"];
// Add paths that should be accessible only to guests
const guestRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtected = protectedRoutes.some((route) => path.startsWith(route));
    const isGuest = guestRoutes.some((route) => path.startsWith(route));

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    let session = null;
    if (sessionCookie) {
        try {
            session = await decrypt(sessionCookie);
        } catch {
            // Invalid session
        }
    }

    // Redirect to login if accessing protected route without session
    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Redirect to dashboard if accessing guest route with session
    if (isGuest && session) {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
