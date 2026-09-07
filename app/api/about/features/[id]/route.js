import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const title = (body.title || "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const result = await query(
    `UPDATE about_features SET title = ?, description = ?, icon = ?, status = ?, sort_order = ?
     WHERE id = ?`,
    [
      title,
      body.description || null,
      body.icon || "ShieldCheck",
      body.status === false || body.status === 0 ? 0 : 1,
      Number(body.sort_order) || 0,
      id,
    ]
  );
  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const result = await query("DELETE FROM about_features WHERE id = ?", [id]);
  if (result.affectedRows === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
