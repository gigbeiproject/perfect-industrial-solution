import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status");

  let sql = "SELECT * FROM product_inquiries WHERE 1=1";
  const paramsList = [];

  if (search) {
    sql += " AND (customer_name LIKE ? OR email LIKE ? OR company_name LIKE ?)";
    paramsList.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    sql += " AND status = ?";
    paramsList.push(status);
  }

  sql += " ORDER BY created_at DESC";

  const inquiries = await query(sql, paramsList);
  return NextResponse.json(inquiries);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  const customer_name = (body.customer_name || "").trim();
  const email = (body.email || "").trim();
  const phone = (body.phone || "").trim();
  const message = (body.message || "").trim();

  if (!customer_name || !email || !phone || !message) {
    return NextResponse.json(
      { error: "Name, email, phone and message are required" },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
  }

  let productName = null;
  if (body.product_id) {
    const product = await queryOne("SELECT name FROM products WHERE id = ?", [body.product_id]);
    productName = product?.name || null;
  }

  const result = await query(
    `INSERT INTO product_inquiries
     (product_id, product_name_snapshot, customer_name, company_name, email, phone, quantity, message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.product_id || null,
      productName,
      customer_name,
      (body.company_name || "").trim() || null,
      email,
      phone,
      (body.quantity || "").trim() || null,
      message,
    ]
  );

  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
