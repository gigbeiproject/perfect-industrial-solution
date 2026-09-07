import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { query } from "@/lib/db";

const COOKIE_NAME = "pis_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set.");
  }
  return new TextEncoder().encode(secret);
}

async function encryptSession(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function decryptSession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

// Verifies the submitted username against the admins table, with an
// optional ADMIN_USERNAME env var as a bootstrap fallback for first login.
export async function verifyAdminUsername(username) {
  const clean = (username || "").trim();
  if (!clean) return null;

  const admin = await query(
    "SELECT id, username, display_name FROM admins WHERE username = ? LIMIT 1",
    [clean]
  );
  if (admin.length > 0) return admin[0];

  const envUsername = process.env.ADMIN_USERNAME;
  if (envUsername && envUsername === clean) {
    return { id: 0, username: clean, display_name: "Administrator" };
  }

  return null;
}

export async function createAdminSession(admin) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const token = await encryptSession({
    adminId: admin.id,
    username: admin.username,
    expiresAt: expiresAt.toISOString(),
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Data Access Layer check — call from admin pages/route handlers that
// require an authenticated admin. Returns the session payload or null.
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return decryptSession(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
