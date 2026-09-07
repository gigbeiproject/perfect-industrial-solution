import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { destroyImage } from "@/lib/cloudinary";

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { imageId } = await params;
  const image = await queryOne("SELECT * FROM product_images WHERE id = ?", [imageId]);
  if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await query("DELETE FROM product_images WHERE id = ?", [imageId]);
  if (image.image_public_id) await destroyImage(image.image_public_id);

  return NextResponse.json({ ok: true });
}
