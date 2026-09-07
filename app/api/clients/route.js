import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const items = await query("SELECT * FROM trusted_clients ORDER BY sort_order ASC, id DESC");
  return NextResponse.json(items);
}

export async function POST(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const company_name = (body.company_name || "").trim();
  if (!company_name || !body.logo_url) {
    return NextResponse.json({ error: "Company name and logo are required" }, { status: 400 });
  }

  const result = await query(
    `INSERT INTO trusted_clients (company_name, logo_url, logo_public_id, website, status, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      company_name,
      body.logo_url,
      body.logo_public_id || null,
      body.website || null,
      body.status === false || body.status === 0 ? 0 : 1,
      Number(body.sort_order) || 0,
    ]
  );
  return NextResponse.json({ id: result.insertId }, { status: 201 });
}
