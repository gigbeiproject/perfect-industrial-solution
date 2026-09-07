import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request, { params }) {
  const { id } = await params;
  const images = await query(
    "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
    [id]
  );
  return NextResponse.json(images);
}

export async function POST(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (!body.image_url) {
    return NextResponse.json({ error: "image_url is required" }, { status: 400 });
  }

  const countRow = await query(
    "SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM product_images WHERE product_id = ?",
    [id]
  );
  const nextOrder = (countRow[0]?.maxOrder ?? -1) + 1;

  const result = await query(
    "INSERT INTO product_images (product_id, image_url, image_public_id, sort_order) VALUES (?, ?, ?, ?)",
    [id, body.image_url, body.image_public_id || null, nextOrder]
  );

  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
