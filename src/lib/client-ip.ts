import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest) {
  const trustedHeaders = [
    request.headers.get("cf-connecting-ip"),
    request.headers.get("x-real-ip"),
    request.headers.get("x-forwarded-for")?.split(",")[0],
  ];

  return trustedHeaders.find((value) => value?.trim())?.trim() ?? "unknown";
}
