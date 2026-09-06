import { NextResponse } from "next/server";
import { clearPendingTwoFactorToken, destroySession } from "@/lib/session";

export async function POST() {
  await destroySession();
  await clearPendingTwoFactorToken();
  return NextResponse.json({ ok: true });
}
