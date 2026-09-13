import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { destroyImage } from "@/lib/uploads";

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const customer_name = (body.customer_name || "").trim();
  const review = (body.review || "").trim();
  if (!customer_name || !review) {
    return NextResponse.json({ error: "Customer name and review are required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT photo_public_id FROM testimonials WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.photo_public_id && body.photo_public_id !== existing.photo_public_id) {
    await destroyImage(existing.photo_public_id);
  }

  await query(
    `UPDATE testimonials SET customer_name = ?, designation = ?, company = ?, review = ?, rating = ?,
     photo_url = ?, photo_public_id = ?, status = ?, sort_order = ? WHERE id = ?`,
    [
      customer_name,
      body.designation || null,
      body.company || null,
      review,
      Math.min(5, Math.max(1, Number(body.rating) || 5)),
      body.photo_url || null,
      body.photo_public_id || null,
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
  const existing = await queryOne("SELECT photo_public_id FROM testimonials WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await query("DELETE FROM testimonials WHERE id = ?", [id]);
  if (existing.photo_public_id) await destroyImage(existing.photo_public_id);

  return NextResponse.json({ ok: true });
}
