import { NextResponse } from "next/server";
import { hashPassword, readUsers } from "@/lib/user-store";
import { login_user } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Jaza barua pepe na neno la siri" },
      { status: 400 }
    );
  }

  const users = await readUsers();
  const user = users.find(
    (entry) => entry.email.toLowerCase() === email.toLowerCase()
  );

  if (!user || user.passwordHash !== hashPassword(password)) {
    return NextResponse.json(
      { error: "Barua pepe au neno la siri si sahihi" },
      { status: 401 }
    );
  }

  const sessionUser = {
    email: user.email,
    ownerName: user.ownerName,
    businessName: user.businessName,
    category: user.category,
  };

  await login_user(sessionUser);

  return NextResponse.json({
    success: true,
    user: sessionUser,
  });
}
