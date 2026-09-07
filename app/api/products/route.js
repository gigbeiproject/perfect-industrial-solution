import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const categoryId = searchParams.get("category_id");
  const status = searchParams.get("status");

  let sql = `SELECT p.*, c.name AS category_name FROM products p
             LEFT JOIN product_categories c ON c.id = p.category_id WHERE 1=1`;
  const paramsList = [];

  if (search) {
    sql += " AND p.name LIKE ?";
    paramsList.push(`%${search}%`);
  }
  if (categoryId) {
    sql += " AND p.category_id = ?";
    paramsList.push(categoryId);
  }
  if (status === "active") {
    sql += " AND p.status = 1";
  } else if (status === "inactive") {
    sql += " AND p.status = 0";
  }

  sql += " ORDER BY p.sort_order ASC, p.id DESC";

  const products = await query(sql, paramsList);
  return NextResponse.json(products);
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const name = (body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  // A name made up entirely of characters slugify() can't map to a-z0-9
  // (e.g. Hindi/Devanagari text, or only symbols) yields an empty slug,
  // which breaks the public /products/[slug] URL. Insert with a unique
  // placeholder and fall back to an id-based slug once the id is known.
  const requestedSlug = slugify(body.slug || name);
  const slug = requestedSlug || randomUUID();

  try {
    const result = await query(
      `INSERT INTO products
       (category_id, name, slug, short_description, description, features, specifications,
        applications, main_image_url, main_image_public_id, status, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );

    const productId = result.insertId;

    if (!requestedSlug) {
      await query("UPDATE products SET slug = ? WHERE id = ?", [`product-${productId}`, productId]);
    }

    if (Array.isArray(body.gallery_images) && body.gallery_images.length > 0) {
      for (let i = 0; i < body.gallery_images.length; i++) {
        const img = body.gallery_images[i];
        await query(
          "INSERT INTO product_images (product_id, image_url, image_public_id, sort_order) VALUES (?, ?, ?, ?)",
          [productId, img.image_url, img.image_public_id || null, i]
        );
      }
    }

    return NextResponse.json({ id: productId }, { status: 201 });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
