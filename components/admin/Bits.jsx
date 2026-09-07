"use client";

import { Loader2, Inbox } from "lucide-react";

export function StatusPill({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-green-600" : "bg-gray-400"}`} />
      {active ? "Active" : "Disabled"}
    </span>
  );
}

export function InquiryStatusPill({ status }) {
  const styles = {
    New: "bg-blue-50 text-blue-700",
    Contacted: "bg-amber-50 text-amber-700",
    "In Progress": "bg-purple-50 text-purple-700",
    Converted: "bg-green-50 text-green-700",
    Closed: "bg-gray-100 text-gray-500",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[status] || styles.New}`}>
      {status}
    </span>
  );
}

export function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-brand" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export function Loading({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted">
      <Loader2 size={28} className="animate-spin" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ label = "No records found", hint }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted">
      <Inbox size={32} className="text-border-muted" />
      <p className="text-sm font-semibold text-ink">{label}</p>
      {hint && <p className="max-w-xs text-xs">{hint}</p>}
    </div>
  );
}

export function FormField({ label, required, children, hint }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-sm border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand";
