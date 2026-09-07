import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const items = await query("SELECT * FROM gallery ORDER BY sort_order ASC, id DESC");
  return NextResponse.json(items);
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  if (!body.image_url) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO gallery (title, description, image_url, image_public_id, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      (body.title || "").trim() || null,
      body.description || null,
      body.image_url,
      body.image_public_id || null,
      body.status === false || body.status === 0 ? 0 : 1,
      Number(body.sort_order) || 0,
    ]
  );
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
