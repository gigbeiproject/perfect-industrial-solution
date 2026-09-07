"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, User, Star } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, StatusPill, Toggle, FormField, inputClass } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY = {
  customer_name: "",
  designation: "",
  company: "",
  review: "",
  rating: 5,
  photo_url: null,
  photo_public_id: null,
  status: true,
  sort_order: 0,
};

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState(null);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/testimonials");
    setItems(await res.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      customer_name: form.get("customer_name"),
      designation: form.get("designation"),
      company: form.get("company"),
      review: form.get("review"),
      rating: form.get("rating"),
      photo_url: modal.data.photo_url,
      photo_public_id: modal.data.photo_public_id,
      status: modal.data.status,
      sort_order: form.get("sort_order"),
    };

    try {
      const isEdit = modal.mode === "edit";
      const res = await fetch(isEdit ? `/api/testimonials/${modal.data.id}` : "/api/testimonials", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(isEdit ? "Testimonial updated" : "Testimonial added");
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
      const res = await fetch(`/api/testimonials/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Testimonial deleted");
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
        <p className="text-sm text-muted">Manage customer testimonials shown on the homepage.</p>
        <button onClick={() => setModal({ mode: "add", data: EMPTY })} className="btn-primary">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="rounded-sm border border-border-muted bg-white card-shadow">
          <EmptyState label="No testimonials yet" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-sm border border-border-muted bg-white p-4 card-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {item.photo_url ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={item.photo_url} alt={item.customer_name} fill className="object-cover" />
                    </div>
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand">
                      <User size={18} />
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-ink">{item.customer_name}</p>
                    <p className="text-xs text-muted">
                      {[item.designation, item.company].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
                <StatusPill active={item.status} />
              </div>
              <div className="mt-2 flex text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill={i < item.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="mt-2 line-clamp-3 text-xs text-muted">{item.review}</p>
              <div className="mt-4 flex gap-2">
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
              {modal.mode === "edit" ? "Edit Testimonial" : "Add Testimonial"}
            </h3>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <ImageUploader
                label="Photo"
                folder="testimonials"
                aspect="aspect-square"
                value={modal.data.photo_url}
                onChange={(img) =>
                  setModal({
                    ...modal,
                    data: {
                      ...modal.data,
                      photo_url: img?.secure_url || null,
                      photo_public_id: img?.public_id || null,
                    },
                  })
                }
              />
              <FormField label="Customer Name" required>
                <input name="customer_name" defaultValue={modal.data.customer_name} required className={inputClass} />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Designation">
                  <input name="designation" defaultValue={modal.data.designation || ""} className={inputClass} />
                </FormField>
                <FormField label="Company">
                  <input name="company" defaultValue={modal.data.company || ""} className={inputClass} />
                </FormField>
              </div>
              <FormField label="Review" required>
                <textarea
                  name="review"
                  defaultValue={modal.data.review}
                  required
                  rows={3}
                  className={inputClass}
                />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Rating (1-5)">
                  <input
                    type="number"
                    name="rating"
                    min={1}
                    max={5}
                    defaultValue={modal.data.rating}
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
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink">Active</span>
                <Toggle
                  checked={modal.data.status}
                  onChange={(val) => setModal({ ...modal, data: { ...modal.data, status: val } })}
                />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? "Saving..." : "Save Testimonial"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete testimonial?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
