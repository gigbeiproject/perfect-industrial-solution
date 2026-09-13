import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { destroyImage } from "@/lib/uploads";

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const company_name = (body.company_name || "").trim();
  if (!company_name) {
    return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT logo_public_id FROM trusted_clients WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (existing.logo_public_id && body.logo_public_id !== existing.logo_public_id) {
    await destroyImage(existing.logo_public_id);
  }

  await query(
    `UPDATE trusted_clients SET company_name = ?, logo_url = ?, logo_public_id = ?, website = ?,
     status = ?, sort_order = ? WHERE id = ?`,
    [
      company_name,
      body.logo_url || null,
      body.logo_public_id || null,
      body.website || null,
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
  const existing = await queryOne("SELECT logo_public_id FROM trusted_clients WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await query("DELETE FROM trusted_clients WHERE id = ?", [id]);
  if (existing.logo_public_id) await destroyImage(existing.logo_public_id);

  return NextResponse.json({ ok: true });
}
