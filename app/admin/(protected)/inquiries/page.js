"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Trash2, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, EmptyState, InquiryStatusPill } from "@/components/admin/Bits";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { formatDateTime, INQUIRY_STATUSES } from "@/lib/utils";

export default function InquiriesAdminPage() {
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [viewing, setViewing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    const res = await fetch(`/api/inquiries?${params}`);
    setItems(await res.json());
  }, [search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function updateStatus(id, newStatus) {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Status updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/inquiries/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Inquiry deleted");
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
        <p className="text-sm text-muted">Leads submitted via product enquiry forms.</p>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company..."
              className="rounded-sm border border-border-muted py-2 pl-9 pr-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-sm border border-border-muted px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="">All Status</option>
            {INQUIRY_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-border-muted bg-white card-shadow">
        {items === null ? (
          <Loading />
        ) : items.length === 0 ? (
          <EmptyState label="No inquiries found" />
        ) : (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border-muted bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink">{item.customer_name}</p>
                    {item.company_name && <p className="text-xs text-muted">{item.company_name}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted">{item.product_name_snapshot || "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    <p>{item.email}</p>
                    <p>{item.phone}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDateTime(item.created_at)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className="rounded-sm border border-border-muted px-2 py-1.5 text-xs outline-none focus:border-brand"
                    >
                      {INQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setViewing(item)}
                        className="rounded-sm border border-border-muted p-2 hover:border-brand hover:text-brand"
                      >
                        <Eye size={14} />
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

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setViewing(null)} />
          <div className="relative w-full max-w-lg rounded-sm bg-white p-6 shadow-2xl">
            <button onClick={() => setViewing(null)} className="absolute right-4 top-4 text-muted hover:text-ink">
              <X size={20} />
            </button>
            <div className="flex items-center justify-between pr-8">
              <h3 className="text-lg font-bold text-ink">{viewing.customer_name}</h3>
              <InquiryStatusPill status={viewing.status} />
            </div>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row label="Company" value={viewing.company_name} />
              <Row label="Email" value={viewing.email} />
              <Row label="Phone" value={viewing.phone} />
              <Row label="Product" value={viewing.product_name_snapshot} />
              <Row label="Quantity" value={viewing.quantity} />
              <Row label="Date" value={formatDateTime(viewing.created_at)} />
            </dl>
            <div className="mt-4 rounded-sm bg-surface p-3 text-sm text-ink">{viewing.message}</div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete inquiry?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <dt className="font-semibold text-ink">{label}</dt>
      <dd className="text-right text-muted">{value}</dd>
    </div>
  );
}
