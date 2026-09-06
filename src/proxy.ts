import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "indibiz_session";
const SESSION_ISSUER = "indibiz-admin";
const SESSION_AUDIENCE = "indibiz-dashboard";
const secretKey = process.env.AUTH_SECRET;

if (!secretKey || secretKey.length < 32) {
  throw new Error("AUTH_SECRET wajib diatur dan panjangnya minimal 32 karakter");
}

const encodedKey = new TextEncoder().encode(secretKey);

// Proxy berjalan di Edge runtime — hanya memverifikasi token,
// tidak menyentuh database. Otorisasi granular per-role tetap dicek
// ulang di setiap Server Action/route handler.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (!isAdminRoute) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
