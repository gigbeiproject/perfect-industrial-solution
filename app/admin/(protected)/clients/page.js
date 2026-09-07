"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, StatusPill, Toggle, FormField, inputClass } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY = { company_name: "", logo_url: null, logo_public_id: null, website: "", status: true, sort_order: 0 };

export default function ClientsAdminPage() {
  const [items, setItems] = useState(null);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/clients");
    setItems(await res.json());
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time fetch on mount
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    if (!modal.data.logo_url) {
      toast.error("Please upload a logo");
      return;
    }
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      company_name: form.get("company_name"),
      website: form.get("website"),
      logo_url: modal.data.logo_url,
      logo_public_id: modal.data.logo_public_id,
      status: modal.data.status,
      sort_order: form.get("sort_order"),
    };

    try {
      const isEdit = modal.mode === "edit";
      const res = await fetch(isEdit ? `/api/clients/${modal.data.id}` : "/api/clients", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(isEdit ? "Client updated" : "Client added");
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
      const res = await fetch(`/api/clients/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Client deleted");
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
        <p className="text-sm text-muted">Manage client logos shown on the homepage.</p>
        <button onClick={() => setModal({ mode: "add", data: EMPTY })} className="btn-primary">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {items === null ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="rounded-sm border border-border-muted bg-white card-shadow">
          <EmptyState
            label="No trusted clients yet"
            hint="Add real client logos once available — avoid placeholder brands."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.id} className="rounded-sm border border-border-muted bg-white p-4 card-shadow">
              <div className="relative h-14 w-full">
                <Image src={item.logo_url} alt={item.company_name} fill className="object-contain" />
              </div>
              <p className="mt-3 truncate text-center text-xs font-semibold text-ink">{item.company_name}</p>
              <div className="mt-1 flex justify-center">
                <StatusPill active={item.status} />
              </div>
              <div className="mt-3 flex gap-2">
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
          <div className="relative my-8 w-full max-w-sm rounded-sm bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-muted hover:text-ink">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-ink">
              {modal.mode === "edit" ? "Edit Client" : "Add Client"}
            </h3>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <ImageUploader
                label="Logo"
                folder="clients"
                aspect="aspect-video"
                value={modal.data.logo_url}
                onChange={(img) =>
                  setModal({
                    ...modal,
                    data: {
                      ...modal.data,
                      logo_url: img?.secure_url || null,
                      logo_public_id: img?.public_id || null,
                    },
                  })
                }
              />
              <FormField label="Company Name" required>
                <input name="company_name" defaultValue={modal.data.company_name} required className={inputClass} />
              </FormField>
              <FormField label="Website">
                <input name="website" defaultValue={modal.data.website || ""} className={inputClass} />
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
                {saving ? "Saving..." : "Save Client"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete client?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
