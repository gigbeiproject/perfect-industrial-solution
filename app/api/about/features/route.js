import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const features = await query("SELECT * FROM about_features ORDER BY sort_order ASC, id ASC");
  return NextResponse.json(features);
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const title = (body.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO about_features (title, description, icon, status, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
    [
      title,
      body.description || null,
      body.icon || "ShieldCheck",
      body.status === false || body.status === 0 ? 0 : 1,
      Number(body.sort_order) || 0,
    ]
  );
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
