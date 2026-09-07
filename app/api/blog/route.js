import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status");

  let sql = "SELECT * FROM blog_posts WHERE 1=1";
  const paramsList = [];

  if (search) {
    sql += " AND title LIKE ?";
    paramsList.push(`%${search}%`);
  }
  if (status === "active") {
    sql += " AND status = 1";
  } else if (status === "inactive") {
    sql += " AND status = 0";
  }

  sql += " ORDER BY created_at DESC";

  const posts = await query(sql, paramsList);
  return NextResponse.json(posts);
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const title = (body.title || "").trim();
  const content = (body.content || "").trim();
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }
  // A title made up entirely of characters slugify() can't map to a-z0-9
  // (e.g. Hindi/Devanagari text) yields an empty slug, which breaks the
  // public /blog/[slug] URL. Insert with a unique placeholder and fall
  // back to an id-based slug once the id is known.
  const requestedSlug = slugify(body.slug || title);
  const slug = requestedSlug || randomUUID();

  try {
    const result = await query(
      `INSERT INTO blog_posts
       (title, slug, excerpt, content, featured_image_url, featured_image_public_id, author, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        body.excerpt || null,
        content,
        body.featured_image_url || null,
        body.featured_image_public_id || null,
        body.author || null,
        body.status === false || body.status === 0 ? 0 : 1,
      ]
    );

    if (!requestedSlug) {
      await query("UPDATE blog_posts SET slug = ? WHERE id = ?", [`post-${result.insertId}`, result.insertId]);
    }

    return NextResponse.json({ id: result.insertId }, { status: 201 });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
