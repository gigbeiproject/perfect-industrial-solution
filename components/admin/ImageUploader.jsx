"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function ImageUploader({
  value,
  onChange,
  folder = "perfect-industrial-solution",
  label,
  aspect = "aspect-video",
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed");
      }
      const data = await res.json();
      onChange({ secure_url: data.secure_url, public_id: data.public_id });
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink">
          {label}
        </label>
      )}
      <div
        className={`relative ${aspect} w-full overflow-hidden rounded-sm border border-dashed border-border-muted bg-surface`}
      >
        {value ? (
          <>
            <Image src={value} alt="Uploaded" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-brand"
              aria-label="Remove image"
            >
              <X size={16} />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-2 right-2 rounded-sm bg-black/60 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand"
            >
              {uploading ? "Uploading..." : "Replace"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted hover:text-brand"
          >
            {uploading ? (
              <Loader2 size={26} className="animate-spin" />
            ) : (
              <>
                <ImageIcon size={26} />
                <span className="flex items-center gap-1.5 text-xs font-semibold">
                  <Upload size={14} /> Click to upload
                </span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
