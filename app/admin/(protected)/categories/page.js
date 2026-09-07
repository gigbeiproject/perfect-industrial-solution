"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, StatusPill, Toggle, FormField, inputClass } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const EMPTY = { name: "", slug: "", description: "", status: true, sort_order: 0 };

export default function CategoriesPage() {
  const [items, setItems] = useState(null);
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', data }
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/categories");
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
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      status: modal.data.status,
      sort_order: form.get("sort_order"),
    };

    try {
      const isEdit = modal.mode === "edit";
      const res = await fetch(isEdit ? `/api/categories/${modal.data.id}` : "/api/categories", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save");
      }
      toast.success(isEdit ? "Category updated" : "Category created");
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
      const res = await fetch(`/api/categories/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Category deleted");
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
        <p className="text-sm text-muted">Manage product categories shown on the products page.</p>
        <button onClick={() => setModal({ mode: "add", data: EMPTY })} className="btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border-muted bg-white card-shadow">
        {items === null ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState label="No categories yet" hint="Add your first product category." />
        ) : (
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-border-muted bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold text-ink">{item.name}</td>
                  <td className="px-4 py-3 text-muted">{item.slug}</td>
                  <td className="px-4 py-3 text-muted">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <StatusPill active={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-md rounded-sm bg-white p-6 shadow-2xl">
            <button
              onClick={() => setModal(null)}
              className="absolute right-4 top-4 text-muted hover:text-ink"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-ink">
              {modal.mode === "edit" ? "Edit Category" : "Add Category"}
            </h3>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <FormField label="Name" required>
                <input name="name" defaultValue={modal.data.name} required className={inputClass} />
              </FormField>
              <FormField label="Slug" hint="Leave blank to auto-generate from name">
                <input name="slug" defaultValue={modal.data.slug} className={inputClass} />
              </FormField>
              <FormField label="Description">
                <textarea
                  name="description"
                  defaultValue={modal.data.description || ""}
                  rows={3}
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
                {saving ? "Saving..." : "Save Category"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete category?"
        message={`This will permanently remove "${deleteTarget?.name}".`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
