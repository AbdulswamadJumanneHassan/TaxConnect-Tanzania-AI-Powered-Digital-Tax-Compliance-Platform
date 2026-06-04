import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "default-secret-key-change-me";
const key = new TextEncoder().encode(secretKey);

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "smart_tax_session";

import { JWTPayload as JosePayload } from "jose";

export interface JWTPayload extends JosePayload {
    id: string;
    email: string;
    ownerName: string;
    businessName: string;
    category: string;
    expires: Date;
}

export async function encrypt(payload: Partial<JWTPayload>) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(key);
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

export async function login_user(user: Partial<JWTPayload>) {
    // Create the session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const session = await encrypt({ ...user, expires });

    // Save the session in a cookie
    (await cookies()).set(SESSION_COOKIE_NAME, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_VERSION === "production",
        sameSite: "lax",
        path: "/",
    });
}

export async function logout_user() {
    // Destroy the session
    (await cookies()).set(SESSION_COOKIE_NAME, "", { expires: new Date(0) });
}

export async function getSession() {
    const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch {
        return null;
    }
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    if (!parsed) return;

    parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}
