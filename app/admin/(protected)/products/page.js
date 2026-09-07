"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, StatusPill } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function ProductsAdminPage() {
  const [items, setItems] = useState(null);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryId) params.set("category_id", categoryId);
    const res = await fetch(`/api/products?${params}`);
    setItems(await res.json());
  }, [search, categoryId]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Product deleted");
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
        <div className="flex flex-1 gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="rounded-sm border border-border-muted py-2 pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-sm border border-border-muted px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Link href="/admin/products/new" className="btn-primary shrink-0">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border-muted bg-white card-shadow">
        {items === null ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState label="No products found" hint="Add your first product." />
        ) : (
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border-muted bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Order</th>
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
                        {item.main_image_url ? (
                          <Image src={item.main_image_url} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-ink">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{item.category_name || "—"}</td>
                  <td className="px-4 py-3 text-muted">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <StatusPill active={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${item.id}/edit`}
                        className="rounded-sm border border-border-muted p-2 hover:border-brand hover:text-brand"
                      >
                        <Pencil size={14} />
                      </Link>
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        message={`This will permanently remove "${deleteTarget?.name}" and its images.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
