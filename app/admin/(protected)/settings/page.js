"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";
import { Loading, FormField, inputClass } from "@/components/admin/Bits";
import ImageUploader from "@/components/admin/ImageUploader";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.logo_url = settings.logo_url;
    payload.logo_public_id = settings.logo_public_id;

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      toast.success("Settings updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
        <h2 className="mb-4 text-sm font-bold text-ink">Company Identity</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[160px_1fr]">
          <ImageUploader
            label="Logo"
            folder="company"
            aspect="aspect-square"
            value={settings.logo_url}
            onChange={(img) =>
              setSettings({
                ...settings,
                logo_url: img?.secure_url || null,
                logo_public_id: img?.public_id || null,
              })
            }
          />
          <div className="space-y-4">
            <FormField label="Company Name" required>
              <input
                name="company_name"
                defaultValue={settings.company_name || ""}
                required
                className={inputClass}
              />
            </FormField>
            <FormField label="Footer Description">
              <textarea
                name="footer_description"
                defaultValue={settings.footer_description || ""}
                rows={3}
                className={inputClass}
              />
            </FormField>
            <FormField label="Years of Experience" hint="Shown in the hero badge and stats section">
              <input
                name="years_experience"
                defaultValue={settings.years_experience || ""}
                className={inputClass}
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
        <h2 className="mb-4 text-sm font-bold text-ink">Contact Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Email">
            <input name="email" type="email" defaultValue={settings.email || ""} className={inputClass} />
          </FormField>
          <FormField label="Phone">
            <input name="phone" defaultValue={settings.phone || ""} className={inputClass} />
          </FormField>
          <FormField label="WhatsApp">
            <input name="whatsapp" defaultValue={settings.whatsapp || ""} className={inputClass} />
          </FormField>
          <FormField label="Working Hours">
            <input name="working_hours" defaultValue={settings.working_hours || ""} className={inputClass} />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Address">
            <textarea name="address" defaultValue={settings.address || ""} rows={2} className={inputClass} />
          </FormField>
        </div>
        <div className="mt-4">
          <FormField label="Google Maps Embed URL" hint="Use the 'Embed a map' iframe src from Google Maps">
            <input
              name="google_maps_url"
              defaultValue={settings.google_maps_url || ""}
              className={inputClass}
            />
          </FormField>
        </div>
      </div>

      <div className="rounded-sm border border-border-muted bg-white p-6 card-shadow">
        <h2 className="mb-4 text-sm font-bold text-ink">Social Media</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Facebook">
            <input name="facebook" defaultValue={settings.facebook || ""} className={inputClass} />
          </FormField>
          <FormField label="Instagram">
            <input name="instagram" defaultValue={settings.instagram || ""} className={inputClass} />
          </FormField>
          <FormField label="LinkedIn">
            <input name="linkedin" defaultValue={settings.linkedin || ""} className={inputClass} />
          </FormField>
          <FormField label="YouTube">
            <input name="youtube" defaultValue={settings.youtube || ""} className={inputClass} />
          </FormField>
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
        <Save size={16} />
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
