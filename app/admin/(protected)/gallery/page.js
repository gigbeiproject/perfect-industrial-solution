"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, StatusPill, Toggle, FormField, inputClass } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY = { title: "", description: "", image_url: null, image_public_id: null, status: true, sort_order: 0 };

export default function GalleryAdminPage() {
  const [items, setItems] = useState(null);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/gallery");
    setItems(await res.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!modal.data.image_url) {
      toast.error("Please upload an image");
      return;
    }
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      image_url: modal.data.image_url,
      image_public_id: modal.data.image_public_id,
      status: modal.data.status,
      sort_order: form.get("sort_order"),
    };

    try {
      const isEdit = modal.mode === "edit";
      const res = await fetch(isEdit ? `/api/gallery/${modal.data.id}` : "/api/gallery", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(isEdit ? "Image updated" : "Image added");
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Image deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted">Manage images shown in the homepage gallery.</p>
        <button onClick={() => setModal({ mode: "add", data: EMPTY })} className="btn-primary">
          <Plus size={16} /> Add Image
        </button>
      </div>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="rounded-sm border border-border-muted bg-white card-shadow">
          <EmptyState label="No gallery images yet" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-sm border border-border-muted bg-white card-shadow">
              <div className="relative aspect-square bg-surface">
                <Image src={item.image_url} alt={item.title || "Gallery"} fill className="object-cover" />
                <div className="absolute right-2 top-2">
                  <StatusPill active={item.status} />
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-semibold text-ink">{item.title || "Untitled"}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => setModal({ mode: "edit", data: item })}
                    className="flex-1 rounded-sm border border-border-muted py-1.5 text-xs hover:border-brand hover:text-brand"
                  >
                    <Pencil size={12} className="mx-auto" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex-1 rounded-sm border border-border-muted py-1.5 text-xs hover:border-red-500 hover:text-red-500"
                  >
                    <Trash2 size={12} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal(null)} />
          <div className="relative my-8 w-full max-w-md rounded-sm bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-muted hover:text-ink">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-ink">
              {modal.mode === "edit" ? "Edit Image" : "Add Image"}
            </h3>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <ImageUploader
                label="Image"
                folder="gallery"
                aspect="aspect-square"
                value={modal.data.image_url}
                onChange={(img) =>
                  setModal({
                    ...modal,
                    data: {
                      ...modal.data,
                      image_url: img?.secure_url || null,
                      image_public_id: img?.public_id || null,
                    },
                  })
                }
              />
              <FormField label="Title">
                <input name="title" defaultValue={modal.data.title || ""} className={inputClass} />
              </FormField>
              <FormField label="Description">
                <textarea
                  name="description"
                  defaultValue={modal.data.description || ""}
                  rows={2}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Sort Order">
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={modal.data.sort_order}
                  className={inputClass}
                />
              </FormField>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink">Active</span>
                <Toggle
                  checked={modal.data.status}
                  onChange={(val) => setModal({ ...modal, data: { ...modal.data, status: val } })}
                />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? "Saving..." : "Save Image"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete image?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
