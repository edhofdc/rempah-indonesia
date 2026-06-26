import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  "rempah-indonesia-secret-key";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

/**
 * Verify JWT token from Authorization header or cookie
 * Returns the decoded user if valid, or redirects with 401
 */
export function verifyAuth(
  request: NextRequest,
): { user: AuthUser } | { error: NextResponse } {
  try {
    // Try Authorization header first
    const authHeader = request.headers.get("Authorization");
    let token: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    // Fallback to cookie
    if (!token) {
      const cookie = request.cookies.get("token");
      if (cookie?.value) {
        token = cookie.value;
      }
    }

    // Fallback to admin_token cookie (set by login page)
    if (!token) {
      const adminCookie = request.cookies.get("admin_token");
      if (adminCookie?.value) {
        token = adminCookie.value;
      }
    }

    if (!token) {
      return {
        error: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 },
        ),
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

    if (!decoded.id || !decoded.username) {
      return {
        error: NextResponse.json(
          { error: "Invalid token payload" },
          { status: 401 },
        ),
      };
    }

    return {
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role || "admin",
      },
    };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return {
        error: NextResponse.json({ error: "Token expired" }, { status: 401 }),
      };
    }
    return {
      error: NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      ),
    };
  }
}
