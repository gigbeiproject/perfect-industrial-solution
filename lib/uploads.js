import { randomUUID } from "node:crypto";
import path from "node:path";
import { mkdir, unlink, writeFile } from "node:fs/promises";

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

function extensionFromMime(mimeType) {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/avif":
      return ".avif";
    default:
      return "";
  }
}

// Mirrors the old Cloudinary helper's shape ({ secure_url, public_id }) so
// callers and the DB columns (image_url / image_public_id) didn't need to change.
export async function uploadBuffer(buffer, folder = "perfect-industrial-solution", mimeType = "") {
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "");
  const dir = path.join(UPLOADS_ROOT, safeFolder);
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${randomUUID()}${extensionFromMime(mimeType)}`;
  await writeFile(path.join(dir, filename), buffer);

  const publicId = path.posix.join(safeFolder, filename);
  return { secure_url: `/uploads/${publicId}`, public_id: publicId };
}

export async function destroyImage(publicId) {
  if (!publicId) return;
  try {
    await unlink(path.join(UPLOADS_ROOT, publicId));
  } catch {
    // Non-fatal: file may already be gone.
  }
}
