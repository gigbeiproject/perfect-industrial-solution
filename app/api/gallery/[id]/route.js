import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { destroyImage } from "@/lib/cloudinary";

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const existing = await queryOne("SELECT image_public_id FROM gallery WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.image_public_id && body.image_public_id !== existing.image_public_id) {
    await destroyImage(existing.image_public_id);
  }

  await query(
    `UPDATE gallery SET title = ?, description = ?, image_url = ?, image_public_id = ?,
     status = ?, sort_order = ? WHERE id = ?`,
    [
      (body.title || "").trim() || null,
      body.description || null,
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
  const existing = await queryOne("SELECT image_public_id FROM gallery WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await query("DELETE FROM gallery WHERE id = ?", [id]);
  if (existing.image_public_id) await destroyImage(existing.image_public_id);

  return NextResponse.json({ ok: true });
}
