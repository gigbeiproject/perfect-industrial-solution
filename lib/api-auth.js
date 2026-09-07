import "server-only";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

// Call at the top of any admin-only Route Handler. Returns a session
// payload on success, or an already-built 401 NextResponse to return
// directly from the handler.
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return { session: null, unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, unauthorized: null };
}
