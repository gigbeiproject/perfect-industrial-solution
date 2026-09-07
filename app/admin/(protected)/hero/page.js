"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Images } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, StatusPill, Toggle, FormField, inputClass } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY = {
  eyebrow: "",
  title: "",
  subtitle: "",
  description: "",
  cta_text: "",
  cta_link: "",
  cta_text_2: "",
  cta_link_2: "",
  image_url: null,
  image_public_id: null,
  status: true,
  sort_order: 0,
};

export default function HeroAdminPage() {
  const [items, setItems] = useState(null);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/hero");
    setItems(await res.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!modal.data.image_url) {
      toast.error("Please upload a background image");
      return;
    }
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      eyebrow: form.get("eyebrow"),
      title: form.get("title"),
      subtitle: form.get("subtitle"),
      description: form.get("description"),
      cta_text: form.get("cta_text"),
      cta_link: form.get("cta_link"),
      cta_text_2: form.get("cta_text_2"),
      cta_link_2: form.get("cta_link_2"),
      image_url: modal.data.image_url,
      image_public_id: modal.data.image_public_id,
      status: modal.data.status,
      sort_order: form.get("sort_order"),
    };

    try {
      const isEdit = modal.mode === "edit";
      const res = await fetch(isEdit ? `/api/hero/${modal.data.id}` : "/api/hero", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save");
      }
      toast.success(isEdit ? "Slide updated" : "Slide created");
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
      const res = await fetch(`/api/hero/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Slide deleted");
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
        <p className="text-sm text-muted">Manage the homepage hero slider (recommended: 3 slides).</p>
        <button onClick={() => setModal({ mode: "add", data: EMPTY })} className="btn-primary">
          <Plus size={16} /> Add Slide
        </button>
      </div>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="rounded-sm border border-border-muted bg-white card-shadow">
          <EmptyState label="No hero slides yet" hint="Add your first homepage slide." />
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-sm border border-border-muted bg-white p-4 card-shadow sm:flex-row sm:items-center"
            >
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-sm bg-surface sm:w-48">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted">
                    <Images size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-ink">{item.title}</h3>
                  <StatusPill active={item.status} />
                </div>
                <p className="mt-1 text-xs text-muted">{item.subtitle}</p>
                <p className="mt-1 text-xs text-muted">Order: {item.sort_order}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal({ mode: "edit", data: item })}
                  className="rounded-sm border border-border-muted p-2 hover:border-brand hover:text-brand"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="rounded-sm border border-border-muted p-2 hover:border-red-500 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal(null)} />
          <div className="relative my-8 w-full max-w-2xl rounded-sm bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-muted hover:text-ink">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-ink">
              {modal.mode === "edit" ? "Edit Slide" : "Add Slide"}
            </h3>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <ImageUploader
                label="Background Image"
                folder="hero"
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
              <FormField label="Eyebrow Text">
                <input name="eyebrow" defaultValue={modal.data.eyebrow || ""} className={inputClass} />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Title" required>
                  <input name="title" defaultValue={modal.data.title} required className={inputClass} />
                </FormField>
                <FormField label="Subtitle">
                  <input name="subtitle" defaultValue={modal.data.subtitle || ""} className={inputClass} />
                </FormField>
              </div>
              <FormField label="Description">
                <textarea
                  name="description"
                  defaultValue={modal.data.description || ""}
                  rows={3}
                  className={inputClass}
                />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Primary CTA Text">
                  <input name="cta_text" defaultValue={modal.data.cta_text || ""} className={inputClass} />
                </FormField>
                <FormField label="Primary CTA Link">
                  <input name="cta_link" defaultValue={modal.data.cta_link || ""} className={inputClass} />
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Secondary CTA Text">
                  <input name="cta_text_2" defaultValue={modal.data.cta_text_2 || ""} className={inputClass} />
                </FormField>
                <FormField label="Secondary CTA Link">
                  <input name="cta_link_2" defaultValue={modal.data.cta_link_2 || ""} className={inputClass} />
                </FormField>
              </div>
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
                {saving ? "Saving..." : "Save Slide"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete slide?"
        message={`This will permanently remove "${deleteTarget?.title}".`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
