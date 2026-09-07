import { NextResponse } from "next/server";
import { verifyAdminUsername, createAdminSession } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const username = (body?.username || "").trim();
  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const admin = await verifyAdminUsername(username);
  if (!admin) {
    return NextResponse.json({ error: "Invalid username" }, { status: 401 });
  }

  await createAdminSession(admin);
  return NextResponse.json({ ok: true });
}
