"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, StatusPill, Toggle, FormField, inputClass } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";
import { ICON_NAMES, resolveIcon } from "@/lib/icon-map";

const EMPTY_FEATURE = { title: "", description: "", icon: "ShieldCheck", status: true, sort_order: 0 };

export default function AboutAdminPage() {
  const [about, setAbout] = useState(null);
  const [savingAbout, setSavingAbout] = useState(false);

  const [features, setFeatures] = useState(null);
  const [modal, setModal] = useState(null);
  const [savingFeature, setSavingFeature] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadAbout() {
    const res = await fetch("/api/about");
    setAbout(await res.json());
  }
  async function loadFeatures() {
    const res = await fetch("/api/about/features");
    setFeatures(await res.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount
    loadAbout();
    loadFeatures();
  }, []);

  async function handleSaveAbout(e) {
    e.preventDefault();
    setSavingAbout(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      label: form.get("label"),
      heading: form.get("heading"),
      description: form.get("description"),
      cta_text: form.get("cta_text"),
      cta_link: form.get("cta_link"),
      image_url: about.image_url,
      image_public_id: about.image_public_id,
    };
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("About section updated");
      loadAbout();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingAbout(false);
    }
  }

  async function handleSaveFeature(e) {
    e.preventDefault();
    setSavingFeature(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      icon: modal.data.icon,
      status: modal.data.status,
      sort_order: form.get("sort_order"),
    };
    try {
      const isEdit = modal.mode === "edit";
      const res = await fetch(
        isEdit ? `/api/about/features/${modal.data.id}` : "/api/about/features",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to save");
      toast.success(isEdit ? "Feature updated" : "Feature created");
      setModal(null);
      loadFeatures();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingFeature(false);
    }
  }

  async function handleDeleteFeature() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/about/features/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Feature deleted");
      setDeleteTarget(null);
      loadFeatures();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (about === null || features === null) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
        <h2 className="text-sm font-bold text-ink">About Us Content</h2>
        <form onSubmit={handleSaveAbout} className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ImageUploader
              label="About Image"
              folder="about"
              value={about.image_url}
              onChange={(img) =>
                setAbout({
                  ...about,
                  image_url: img?.secure_url || null,
                  image_public_id: img?.public_id || null,
                })
              }
            />
          </div>
          <div className="space-y-4 lg:col-span-2">
            <FormField label="Section Label">
              <input name="label" defaultValue={about.label || ""} className={inputClass} />
            </FormField>
            <FormField label="Heading" required>
              <input name="heading" defaultValue={about.heading || ""} required className={inputClass} />
            </FormField>
            <FormField label="Description">
              <textarea
                name="description"
                defaultValue={about.description || ""}
                rows={4}
                className={inputClass}
              />
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="CTA Text">
                <input name="cta_text" defaultValue={about.cta_text || ""} className={inputClass} />
              </FormField>
              <FormField label="CTA Link">
                <input name="cta_link" defaultValue={about.cta_link || ""} className={inputClass} />
              </FormField>
            </div>
            <button type="submit" disabled={savingAbout} className="btn-primary disabled:opacity-60">
              <Save size={16} />
              {savingAbout ? "Saving..." : "Save About Section"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-ink">Feature Highlight Cards</h2>
          <button
            onClick={() => setModal({ mode: "add", data: EMPTY_FEATURE })}
            className="btn-primary"
          >
            <Plus size={16} /> Add Feature
          </button>
        </div>

        {features.length === 0 ? (
          <div className="rounded-sm border border-border-muted bg-white card-shadow">
            <EmptyState label="No feature cards yet" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = resolveIcon(f.icon);
              return (
                <div key={f.id} className="rounded-sm border border-border-muted bg-white p-4 card-shadow">
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand">
                      <Icon size={20} />
                    </span>
                    <StatusPill active={f.status} />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-ink">{f.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{f.description}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setModal({ mode: "edit", data: f })}
                      className="flex-1 rounded-sm border border-border-muted py-1.5 text-xs hover:border-brand hover:text-brand"
                    >
                      <Pencil size={12} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(f)}
                      className="flex-1 rounded-sm border border-border-muted py-1.5 text-xs hover:border-red-500 hover:text-red-500"
                    >
                      <Trash2 size={12} className="mx-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal(null)} />
          <div className="relative my-8 w-full max-w-md rounded-sm bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-muted hover:text-ink">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-ink">
              {modal.mode === "edit" ? "Edit Feature" : "Add Feature"}
            </h3>
            <form onSubmit={handleSaveFeature} className="mt-5 space-y-4">
              <FormField label="Title" required>
                <input name="title" defaultValue={modal.data.title} required className={inputClass} />
              </FormField>
              <FormField label="Description">
                <textarea
                  name="description"
                  defaultValue={modal.data.description || ""}
                  rows={3}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Icon">
                <select
                  value={modal.data.icon}
                  onChange={(e) => setModal({ ...modal, data: { ...modal.data, icon: e.target.value } })}
                  className={inputClass}
                >
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
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
              <button type="submit" disabled={savingFeature} className="btn-primary w-full disabled:opacity-60">
                {savingFeature ? "Saving..." : "Save Feature"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete feature?"
        message={`This will permanently remove "${deleteTarget?.title}".`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteFeature}
        loading={deleting}
      />
    </div>
  );
}
