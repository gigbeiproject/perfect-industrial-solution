"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { FormField, inputClass, Toggle } from "@/components/admin/Bits";
import ImageUploader from "@/components/admin/ImageUploader";

export default function ProductForm({ mode, categories, initialProduct }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [mainImage, setMainImage] = useState({
    url: initialProduct?.main_image_url || null,
    publicId: initialProduct?.main_image_public_id || null,
  });
  const [status, setStatus] = useState(initialProduct ? Boolean(initialProduct.status) : true);
  const [gallery, setGallery] = useState(
    (initialProduct?.images || []).map((img) => ({
      id: img.id,
      image_url: img.image_url,
      image_public_id: img.image_public_id,
    }))
  );
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [pendingUpload, setPendingUpload] = useState(false);

  function addGalleryImage(img) {
    if (!img) return;
    setGallery((prev) => [...prev, { id: null, image_url: img.secure_url, image_public_id: img.public_id }]);
  }

  function removeGalleryImage(index) {
    const item = gallery[index];
    if (item.id) setRemovedImageIds((prev) => [...prev, item.id]);
    setGallery((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mainImage.url) {
      toast.error("Please upload a main product image");
      return;
    }
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      category_id: form.get("category_id") || null,
      name: form.get("name"),
      slug: form.get("slug"),
      short_description: form.get("short_description"),
      description: form.get("description"),
      features: form.get("features"),
      specifications: form.get("specifications"),
      applications: form.get("applications"),
      main_image_url: mainImage.url,
      main_image_public_id: mainImage.publicId,
      status,
      sort_order: form.get("sort_order"),
    };

    try {
      if (mode === "new") {
        payload.gallery_images = gallery.map((g) => ({
          image_url: g.image_url,
          image_public_id: g.image_public_id,
        }));

        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to create product");
        }
        toast.success("Product created");
      } else {
        const res = await fetch(`/api/products/${initialProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to update product");
        }

        for (const id of removedImageIds) {
          await fetch(`/api/products/${initialProduct.id}/images/${id}`, { method: "DELETE" });
        }
        for (const img of gallery.filter((g) => !g.id)) {
          await fetch(`/api/products/${initialProduct.id}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_url: img.image_url, image_public_id: img.image_public_id }),
          });
        }
        toast.success("Product updated");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
            <h2 className="mb-4 text-sm font-bold text-ink">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Product Name" required>
                  <input
                    name="name"
                    defaultValue={initialProduct?.name || ""}
                    required
                    className={inputClass}
                  />
                </FormField>
                <FormField label="Category">
                  <select
                    name="category_id"
                    defaultValue={initialProduct?.category_id || ""}
                    className={inputClass}
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
              <FormField label="Slug" hint="Leave blank to auto-generate from name">
                <input name="slug" defaultValue={initialProduct?.slug || ""} className={inputClass} />
              </FormField>
              <FormField label="Short Description" hint="Shown on product cards and listing pages">
                <textarea
                  name="short_description"
                  defaultValue={initialProduct?.short_description || ""}
                  rows={2}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Full Description">
                <textarea
                  name="description"
                  defaultValue={initialProduct?.description || ""}
                  rows={5}
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>

          <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
            <h2 className="mb-1 text-sm font-bold text-ink">Details</h2>
            <p className="mb-4 text-xs text-muted">Enter one item per line for each field.</p>
            <div className="space-y-4">
              <FormField label="Features" hint="One feature per line">
                <textarea
                  name="features"
                  defaultValue={initialProduct?.features || ""}
                  rows={4}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Specifications" hint="One per line, format: Key: Value">
                <textarea
                  name="specifications"
                  defaultValue={initialProduct?.specifications || ""}
                  rows={4}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Applications" hint="One application per line">
                <textarea
                  name="applications"
                  defaultValue={initialProduct?.applications || ""}
                  rows={4}
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
            <h2 className="mb-4 text-sm font-bold text-ink">Main Image</h2>
            <ImageUploader
              folder="products"
              value={mainImage.url}
              onChange={(img) => setMainImage({ url: img?.secure_url || null, publicId: img?.public_id || null })}
            />
          </div>

          <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
            <h2 className="mb-4 text-sm font-bold text-ink">Gallery Images</h2>
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((img, index) => (
                <div key={img.id || img.image_url} className="relative aspect-square overflow-hidden rounded-sm border border-border-muted">
                  <Image src={img.image_url} alt="Gallery" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-border-muted text-muted hover:text-brand">
                {pendingUpload ? (
                  <span className="text-[11px]">Uploading...</span>
                ) : (
                  <>
                    <Plus size={20} />
                    <span className="text-[10px]">Add</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={pendingUpload}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPendingUpload(true);
                    try {
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("folder", "products");
                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      addGalleryImage(data);
                    } catch (err) {
                      toast.error(err.message);
                    } finally {
                      setPendingUpload(false);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
            <h2 className="mb-4 text-sm font-bold text-ink">Organization</h2>
            <div className="space-y-4">
              <FormField label="Sort Order">
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={initialProduct?.sort_order || 0}
                  className={inputClass}
                />
              </FormField>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink">Active</span>
                <Toggle checked={status} onChange={setStatus} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
            <Save size={16} />
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
