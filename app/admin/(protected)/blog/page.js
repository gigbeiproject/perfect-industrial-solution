"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Search, Newspaper } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, StatusPill, Toggle, FormField, inputClass } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";
import { formatDate } from "@/lib/utils";

const EMPTY = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  featured_image_url: null,
  featured_image_public_id: null,
  status: true,
};

export default function BlogAdminPage() {
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    const res = await fetch(`/api/blog?${params}`);
    setItems(await res.json());
  }, [search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      slug: form.get("slug"),
      excerpt: form.get("excerpt"),
      content: form.get("content"),
      author: form.get("author"),
      featured_image_url: modal.data.featured_image_url,
      featured_image_public_id: modal.data.featured_image_public_id,
      status: modal.data.status,
    };

    try {
      const isEdit = modal.mode === "edit";
      const res = await fetch(isEdit ? `/api/blog/${modal.data.id}` : "/api/blog", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to save");
      }
      toast.success(isEdit ? "Post updated" : "Post created");
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
      const res = await fetch(`/api/blog/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Post deleted");
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
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="rounded-sm border border-border-muted py-2 pl-9 pr-3 text-sm outline-none focus:border-brand"
          />
        </div>
        <button onClick={() => setModal({ mode: "add", data: EMPTY })} className="btn-primary shrink-0">
          <Plus size={16} /> Add Post
        </button>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border-muted bg-white card-shadow">
        {items === null ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState label="No blog posts yet" hint="Add your first article." />
        ) : (
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border-muted bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm bg-surface">
                        {item.featured_image_url ? (
                          <Image
                            src={item.featured_image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted">
                            <Newspaper size={16} />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-ink">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{item.author || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(item.created_at)}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModal(null)} />
          <div className="relative my-8 w-full max-w-2xl rounded-sm bg-white p-6 shadow-2xl">
            <button onClick={() => setModal(null)} className="absolute right-4 top-4 text-muted hover:text-ink">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-ink">
              {modal.mode === "edit" ? "Edit Post" : "Add Post"}
            </h3>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <ImageUploader
                label="Featured Image"
                folder="blog"
                value={modal.data.featured_image_url}
                onChange={(img) =>
                  setModal({
                    ...modal,
                    data: {
                      ...modal.data,
                      featured_image_url: img?.secure_url || null,
                      featured_image_public_id: img?.public_id || null,
                    },
                  })
                }
              />
              <FormField label="Title" required>
                <input name="title" defaultValue={modal.data.title} required className={inputClass} />
              </FormField>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Slug" hint="Leave blank to auto-generate from title">
                  <input name="slug" defaultValue={modal.data.slug} className={inputClass} />
                </FormField>
                <FormField label="Author">
                  <input
                    name="author"
                    defaultValue={modal.data.author || "Perfect Industrial Solution"}
                    className={inputClass}
                  />
                </FormField>
              </div>
              <FormField label="Excerpt" hint="Short summary shown on the blog listing page">
                <textarea
                  name="excerpt"
                  defaultValue={modal.data.excerpt || ""}
                  rows={2}
                  className={inputClass}
                />
              </FormField>
              <FormField label="Content" required hint="Use blank lines to separate paragraphs">
                <textarea
                  name="content"
                  defaultValue={modal.data.content}
                  required
                  rows={8}
                  className={inputClass}
                />
              </FormField>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-ink">Published</span>
                <Toggle
                  checked={modal.data.status}
                  onChange={(val) => setModal({ ...modal, data: { ...modal.data, status: val } })}
                />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? "Saving..." : "Save Post"}
              </button>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete post?"
        message={`This will permanently remove "${deleteTarget?.title}".`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
