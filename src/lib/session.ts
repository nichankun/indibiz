import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "indibiz_session";
const secretKey = process.env.AUTH_SECRET;

if (!secretKey) {
  throw new Error("AUTH_SECRET belum diatur di file .env");
}

const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: number;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "sales" | "viewer";
};

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 jam
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const ROLE_PERMISSIONS = {
  super_admin: ["*"],
  admin: ["leads:read", "leads:write", "packages:read", "packages:write", "reports:read"],
  sales: ["leads:read", "leads:write:assigned", "reports:read:own"],
  viewer: ["leads:read", "reports:read"],
} as const;

export function canAccessAdmin(role: SessionPayload["role"]) {
  return ["super_admin", "admin", "sales", "viewer"].includes(role);
}
