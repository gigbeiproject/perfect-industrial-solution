import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";
import { destroyImage } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  const { id } = await params;
  const product = await queryOne(
    `SELECT p.*, c.name AS category_name FROM products p
     LEFT JOIN product_categories c ON c.id = p.category_id WHERE p.id = ?`,
    [id]
  );
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const images = await query(
    "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
    [id]
  );

  return NextResponse.json({ ...product, images });
}

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const slug = slugify(body.slug || name) || `product-${id}`;

  const existing = await queryOne("SELECT main_image_public_id FROM products WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (
    existing.main_image_public_id &&
    body.main_image_public_id !== existing.main_image_public_id
  ) {
    await destroyImage(existing.main_image_public_id);
  }

  try {
    await query(
      `UPDATE products SET category_id = ?, name = ?, slug = ?, short_description = ?, description = ?,
       features = ?, specifications = ?, applications = ?, main_image_url = ?, main_image_public_id = ?,
       status = ?, sort_order = ? WHERE id = ?`,
      [
        body.category_id || null,
        name,
        slug,
        body.short_description || null,
        body.description || null,
        body.features || null,
        body.specifications || null,
        body.applications || null,
        body.main_image_url || null,
        body.main_image_public_id || null,
        body.status === false || body.status === 0 ? 0 : 1,
        Number(body.sort_order) || 0,
        id,
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const product = await queryOne("SELECT main_image_public_id FROM products WHERE id = ?", [id]);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const images = await query("SELECT image_public_id FROM product_images WHERE product_id = ?", [id]);

  await query("DELETE FROM products WHERE id = ?", [id]); // product_images cascade via FK

  if (product.main_image_public_id) await destroyImage(product.main_image_public_id);
  for (const img of images) {
    if (img.image_public_id) await destroyImage(img.image_public_id);
  }

  return NextResponse.json({ ok: true });
}
