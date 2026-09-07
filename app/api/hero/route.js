import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const slides = await query("SELECT * FROM hero_slides ORDER BY sort_order ASC, id DESC");
  return NextResponse.json(slides);
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const title = (body.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.image_url) {
    return NextResponse.json({ error: "Background image is required" }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO hero_slides
     (eyebrow, title, subtitle, description, cta_text, cta_link, cta_text_2, cta_link_2,
      image_url, image_public_id, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.eyebrow || null,
      title,
      body.subtitle || null,
      body.description || null,
      body.cta_text || null,
      body.cta_link || null,
      body.cta_text_2 || null,
      body.cta_link_2 || null,
      body.image_url,
      body.image_public_id || null,
      body.status === false || body.status === 0 ? 0 : 1,
      Number(body.sort_order) || 0,
    ]
  );
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
