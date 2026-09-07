import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status");

  let sql = "SELECT * FROM contact_messages WHERE 1=1";
  const paramsList = [];

  if (search) {
    sql += " AND (name LIKE ? OR email LIKE ? OR company LIKE ?)";
    paramsList.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (status) {
    sql += " AND status = ?";
    paramsList.push(status);
  }

  sql += " ORDER BY created_at DESC";

  const messages = await query(sql, paramsList);
  return NextResponse.json(messages);
}
