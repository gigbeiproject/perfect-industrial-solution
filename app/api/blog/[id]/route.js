import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";
import { destroyImage } from "@/lib/cloudinary";

export async function GET(request, { params }) {
  const { id } = await params;
  const post = await queryOne("SELECT * FROM blog_posts WHERE id = ?", [id]);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const title = (body.title || "").trim();
  const content = (body.content || "").trim();
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }
  const slug = slugify(body.slug || title) || `post-${id}`;

  const existing = await queryOne("SELECT featured_image_public_id FROM blog_posts WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (
    existing.featured_image_public_id &&
    body.featured_image_public_id !== existing.featured_image_public_id
  ) {
    await destroyImage(existing.featured_image_public_id);
  }

  try {
    await query(
      `UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, content = ?, featured_image_url = ?,
       featured_image_public_id = ?, author = ?, status = ? WHERE id = ?`,
      [
        title,
        slug,
        body.excerpt || null,
        content,
        body.featured_image_url || null,
        body.featured_image_public_id || null,
        body.author || null,
        body.status === false || body.status === 0 ? 0 : 1,
        id,
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const existing = await queryOne("SELECT featured_image_public_id FROM blog_posts WHERE id = ?", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await query("DELETE FROM blog_posts WHERE id = ?", [id]);
  if (existing.featured_image_public_id) await destroyImage(existing.featured_image_public_id);

  return NextResponse.json({ ok: true });
}
