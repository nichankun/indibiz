import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/database/schema";

const SESSION_COOKIE = "indibiz_session";
const SESSION_ISSUER = "indibiz-admin";
const SESSION_AUDIENCE = "indibiz-dashboard";
const secretKey = process.env.AUTH_SECRET;

if (!secretKey || secretKey.length < 32) {
  throw new Error("AUTH_SECRET wajib diatur dan panjangnya minimal 32 karakter");
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
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setSubject(String(payload.userId))
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
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    const userId = Number(payload.sub ?? payload.userId);
    if (!Number.isInteger(userId) || userId <= 0) return null;

    const user = await db.query.users.findFirst({
      columns: { id: true, email: true, name: true, role: true, isActive: true },
      where: eq(users.id, userId),
    });

    if (!user?.isActive) return null;

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ---------- Token sementara untuk alur login 2 langkah (2FA) ----------
const PENDING_2FA_COOKIE = "indibiz_2fa_pending";

export type PendingTwoFactorPayload = {
  userId: number;
  email: string;
  name: string;
  role: SessionPayload["role"];
};

export async function createPendingTwoFactorToken(payload: PendingTwoFactorPayload) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const token = await new SignJWT({ ...payload, pending2fa: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setSubject(String(payload.userId))
    .setExpirationTime(expiresAt)
    .sign(encodedKey);

  const cookieStore = await cookies();
  cookieStore.set(PENDING_2FA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function getPendingTwoFactorToken(): Promise<PendingTwoFactorPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PENDING_2FA_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (!payload.pending2fa) return null;
    const userId = Number(payload.sub ?? payload.userId);
    if (
      !Number.isInteger(userId) ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      !["super_admin", "admin", "sales", "viewer"].includes(String(payload.role))
    ) {
      return null;
    }

    return {
      userId,
      email: payload.email,
      name: payload.name,
      role: payload.role as PendingTwoFactorPayload["role"],
    };
  } catch {
    return null;
  }
}

export async function clearPendingTwoFactorToken() {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_2FA_COOKIE);
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

export function hasPermission(role: SessionPayload["role"], permission: string) {
  const perms = ROLE_PERMISSIONS[role] as readonly string[];
  return perms.includes("*") || perms.includes(permission);
}
