import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  ownerName: string;
  businessName: string;
  category: string;
  location?: string;
  estRevenue?: string;
  createdAt: string;
}

const USERS_DIR = join(process.cwd(), "data");
const USERS_FILE = join(USERS_DIR, "users.json");

async function ensureUsersFile() {
  try {
    await access(USERS_FILE);
  } catch {
    await mkdir(USERS_DIR, { recursive: true });
    await writeFile(USERS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

export async function readUsers(): Promise<StoredUser[]> {
  await ensureUsersFile();
  const data = await readFile(USERS_FILE, "utf8");
  try {
    return JSON.parse(data) as StoredUser[];
  } catch {
    return [];
  }
}

export async function writeUsers(users: StoredUser[]) {
  await ensureUsersFile();
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}
