import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO contact_messages (name, email, phone, company, subject, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      (body.phone || "").trim() || null,
      (body.company || "").trim() || null,
      (body.subject || "").trim() || null,
      message,
    ]
  );

  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
