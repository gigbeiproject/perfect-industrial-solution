"use client";

import { useState } from "react";
import { X, Send, MessageSquareText } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductInquiryForm({ productId, productName }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, product_id: productId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      toast.success("Your inquiry has been submitted. We'll get back to you soon.");
      form.reset();
      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to submit inquiry.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="btn-primary w-full sm:w-auto">
        <MessageSquareText size={16} />
        Enquire Now
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-sm bg-white p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 text-muted hover:text-ink"
            >
              <X size={22} />
            </button>

            <h3 className="text-lg font-extrabold text-ink md:text-xl">Enquire Now</h3>
            <p className="mt-1 text-sm text-muted">
              Product: <span className="font-semibold text-brand">{productName}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name" name="customer_name" required />
                <Field label="Company Name" name="company_name" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Email" name="email" type="email" required />
                <Field label="Phone" name="phone" type="tel" required />
              </div>
              <Field label="Quantity" name="quantity" placeholder="e.g. 100 units" />
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink">
                  Message <span className="text-brand">*</span>
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full rounded-sm border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand"
                  placeholder="Tell us about your requirement..."
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
                <Send size={16} />
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, name, type = "text", required = false, placeholder = "" }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-sm border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}
