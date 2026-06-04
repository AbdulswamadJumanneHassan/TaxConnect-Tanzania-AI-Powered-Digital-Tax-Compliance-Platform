import { NextResponse } from "next/server";
import { logout_user } from "@/lib/auth";

export async function POST() {
    await logout_user();
    return NextResponse.json({ success: true });
}
