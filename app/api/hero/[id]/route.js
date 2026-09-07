import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { destroyImage } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  const { id } = await params;
  const slide = await queryOne("SELECT * FROM hero_slides WHERE id = ?", [id]);
  if (!slide) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(slide);
}

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const title = (body.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT image_public_id FROM hero_slides WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.image_public_id && body.image_public_id !== existing.image_public_id) {
    await destroyImage(existing.image_public_id);
  }

  await query(
    `UPDATE hero_slides SET eyebrow = ?, title = ?, subtitle = ?, description = ?, cta_text = ?,
     cta_link = ?, cta_text_2 = ?, cta_link_2 = ?, image_url = ?, image_public_id = ?,
     status = ?, sort_order = ? WHERE id = ?`,
    [
      body.eyebrow || null,
      title,
      body.subtitle || null,
      body.description || null,
      body.cta_text || null,
      body.cta_link || null,
      body.cta_text_2 || null,
      body.cta_link_2 || null,
      body.image_url || null,
      body.image_public_id || null,
      body.status === false || body.status === 0 ? 0 : 1,
      Number(body.sort_order) || 0,
      id,
    ]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await queryOne("SELECT image_public_id FROM hero_slides WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await query("DELETE FROM hero_slides WHERE id = ?", [id]);
  if (existing.image_public_id) await destroyImage(existing.image_public_id);

  return NextResponse.json({ ok: true });
}
