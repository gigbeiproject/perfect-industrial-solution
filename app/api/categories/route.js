import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await query(
    "SELECT * FROM product_categories ORDER BY sort_order ASC, id DESC"
  );
  return NextResponse.json(categories);
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
  // (e.g. Hindi/Devanagari text) yields an empty slug, which breaks the
  // public /products?category=[slug] filter. Insert with a unique
  // placeholder and fall back to an id-based slug once the id is known.
  const requestedSlug = slugify(body.slug || name);
  const slug = requestedSlug || randomUUID();

  try {
    const result = await query(
      `INSERT INTO product_categories (name, slug, description, status, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        body.description || null,
        body.status === false || body.status === 0 ? 0 : 1,
        Number(body.sort_order) || 0,
      ]
    );

    if (!requestedSlug) {
      await query("UPDATE product_categories SET slug = ? WHERE id = ?", [`category-${result.insertId}`, result.insertId]);
    }

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
