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

// ---------- Token sementara untuk alur login 2 langkah (2FA) ----------
// Dibuat setelah email+password valid tapi sebelum kode TOTP diverifikasi.
// Berumur pendek (5 menit) dan tidak memberi akses ke rute /admin manapun —
// hanya dipakai oleh endpoint verifikasi 2FA untuk tahu siapa yang login.

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
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    if (!payload.pending2fa) return null;
    return payload as unknown as PendingTwoFactorPayload;
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
