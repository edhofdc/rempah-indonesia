import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// JWT secret key must be a Uint8Array for jose
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "rempah-indonesia-secret-key",
);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only protect /api/admin/* routes
  if (!path.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  // Extract token: Authorization header > cookie
  const authHeader = request.headers.get("Authorization");
  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }
  if (!token) {
    token = request.cookies.get("token")?.value || null;
  }
  if (!token) {
    token = request.cookies.get("admin_token")?.value || null;
  }

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  try {
    // jose works on Edge Runtime (unlike jsonwebtoken)
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}

export const config = {
  matcher: "/api/admin/:path*",
};
