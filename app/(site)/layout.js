import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCompanySettings } from "@/lib/settings";

export default async function SiteLayout({ children }) {
  const settings = await getCompanySettings();

  return (
    <>
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
