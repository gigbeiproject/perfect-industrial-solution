"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      toast.success("Message sent. We'll get back to you shortly.");
      form.reset();
    } catch (err) {
      toast.error(err.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Company" name="company" />
      </div>
      <Field label="Subject" name="subject" />
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink">
          Message <span className="text-brand">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-sm border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand"
          placeholder="How can we help you?"
        />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        <Send size={16} />
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", required = false }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-sm border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
    </div>
  );
}
