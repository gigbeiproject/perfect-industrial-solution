import { cache } from "react";
import { query } from "@/lib/db";

// Cached per request — avoids re-querying company_settings for every
// component that needs it (header, footer, contact page, metadata, etc).
export const getCompanySettings = cache(async function getCompanySettings() {
  const rows = await query("SELECT * FROM company_settings LIMIT 1");
  return (
    rows[0] || {
      company_name: "Perfect Industrial Solution",
      logo_url: null,
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      google_maps_url: "",
      working_hours: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      footer_description: "",
      years_experience: "20+",
    }
  );
});
