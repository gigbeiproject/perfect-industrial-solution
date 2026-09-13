import path from "node:path";
import { readFile, stat } from "node:fs/promises";
import { NextResponse } from "next/server";
import { UPLOADS_ROOT } from "@/lib/uploads";

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(request, { params }) {
  const { path: segments } = await params;
  const filePath = path.join(UPLOADS_ROOT, ...segments);

  // Reject any path that escapes the uploads root (e.g. via "..").
  if (filePath !== UPLOADS_ROOT && !filePath.startsWith(UPLOADS_ROOT + path.sep)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const [data, fileStat] = await Promise.all([readFile(filePath), stat(filePath)]);
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(fileStat.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
