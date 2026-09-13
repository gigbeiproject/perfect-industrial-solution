import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { destroyImage } from "@/lib/uploads";

export async function GET() {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const settings = await queryOne("SELECT * FROM company_settings ORDER BY id ASC LIMIT 1");
  return NextResponse.json(settings || {});
}

const FIELDS = [
  "company_name",
  "email",
  "phone",
  "whatsapp",
  "address",
  "google_maps_url",
  "working_hours",
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
  "footer_description",
  "years_experience",
];

export async function PUT(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => ({}));
  const company_name = (body.company_name || "").trim();
  if (!company_name) {
    return NextResponse.json({ error: "Company name is required" }, { status: 400 });
  }

  const existing = await queryOne("SELECT * FROM company_settings ORDER BY id ASC LIMIT 1");

  if (existing?.logo_public_id && body.logo_public_id !== existing.logo_public_id) {
    await destroyImage(existing.logo_public_id);
  }

  const values = FIELDS.map((f) => (f === "company_name" ? company_name : body[f] || null));

  if (existing) {
    await query(
      `UPDATE company_settings SET ${FIELDS.map((f) => `${f} = ?`).join(", ")},
       logo_url = ?, logo_public_id = ? WHERE id = ?`,
      [...values, body.logo_url || null, body.logo_public_id || null, existing.id]
    );
  } else {
    await query(
      `INSERT INTO company_settings (${FIELDS.join(", ")}, logo_url, logo_public_id)
       VALUES (${FIELDS.map(() => "?").join(", ")}, ?, ?)`,
      [...values, body.logo_url || null, body.logo_public_id || null]
    );
  }

  return NextResponse.json({ ok: true });
}
