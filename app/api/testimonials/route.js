import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const items = await query("SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC");
  return NextResponse.json(items);
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const customer_name = (body.customer_name || "").trim();
  const review = (body.review || "").trim();
  if (!customer_name || !review) {
    return NextResponse.json({ error: "Customer name and review are required" }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO testimonials
     (customer_name, designation, company, review, rating, photo_url, photo_public_id, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
    ]
  );
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
