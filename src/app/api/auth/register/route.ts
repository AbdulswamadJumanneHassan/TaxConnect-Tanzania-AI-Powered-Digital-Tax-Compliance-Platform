import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hashPassword, readUsers, writeUsers } from "@/lib/user-store";
import { login_user } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, ownerName, businessName, category, location, estRevenue } = body;

  if (!email || !password || !ownerName || !businessName || !category) {
    return NextResponse.json(
      { error: "Tafadhali jaza habari zote muhimu" },
      { status: 400 }
    );
  }

  const users = await readUsers();
  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return NextResponse.json(
      { error: "Barua pepe hii tayari imetumika" },
      { status: 409 }
    );
  }

  const newUser = {
    id: randomUUID(),
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    ownerName,
    businessName,
    category,
    location,
    estRevenue,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsers(users);

  const sessionUser = {
    email: newUser.email,
    ownerName: newUser.ownerName,
    businessName: newUser.businessName,
    category: newUser.category,
  };

  await login_user(sessionUser);

  return NextResponse.json(
    {
      success: true,
      user: sessionUser,
    },
    { status: 201 }
  );
}
