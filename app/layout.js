import { Inter } from "next/font/google";
import "./globals.css";
import ToasterProvider from "@/components/ui/ToasterProvider";
import { getCompanySettings } from "@/lib/settings";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

// This app is entirely admin/DB-driven content (hero slides, products,
// settings, etc.) — force dynamic rendering everywhere so edits made in
// the admin panel show up immediately without a rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getCompanySettings();
  const name = settings.company_name || "Perfect Industrial Solution";
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    ),
    title: {
      default: `${name} | Complete Industrial Solutions`,
      template: `%s | ${name}`,
    },
    description:
      settings.footer_description ||
      "Perfect Industrial Solution provides high-quality industrial products and services for oil & gas, chemical, power, water treatment, pharmaceutical and manufacturing industries.",
    openGraph: {
      title: name,
      description:
        settings.footer_description ||
        "Complete industrial solutions for every industry.",
      siteName: name,
      type: "website",
    },
  };
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-ink">
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
