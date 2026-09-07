import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { destroyImage } from "@/lib/cloudinary";

export async function GET() {
  const about = await queryOne("SELECT * FROM about_sections ORDER BY id ASC LIMIT 1");
  return NextResponse.json(about || {});
}

export async function PUT(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const heading = (body.heading || "").trim();
  if (!heading) {
    return NextResponse.json({ error: "Heading is required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT * FROM about_sections ORDER BY id ASC LIMIT 1");

  if (existing?.image_public_id && body.image_public_id !== existing.image_public_id) {
    await destroyImage(existing.image_public_id);
  }

  if (existing) {
    await query(
      `UPDATE about_sections SET label = ?, heading = ?, description = ?, image_url = ?,
       image_public_id = ?, cta_text = ?, cta_link = ? WHERE id = ?`,
      [
        body.label || null,
        heading,
        body.description || null,
        body.image_url || null,
        body.image_public_id || null,
        body.cta_text || null,
        body.cta_link || null,
        existing.id,
      ]
    );
  } else {
    await query(
      `INSERT INTO about_sections (label, heading, description, image_url, image_public_id, cta_text, cta_link)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        body.label || null,
        heading,
        body.description || null,
        body.image_url || null,
        body.image_public_id || null,
        body.cta_text || null,
        body.cta_link || null,
      ]
    );
  }

  return NextResponse.json({ ok: true });
}
