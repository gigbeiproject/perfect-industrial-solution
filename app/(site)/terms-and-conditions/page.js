import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms & Conditions" crumbs={[{ label: "Terms & Conditions" }]} />
      <section className="section-py bg-white">
        <div className="container-px max-w-3xl mx-auto space-y-5 text-sm leading-relaxed text-muted md:text-base">
          <p>
            This placeholder Terms &amp; Conditions page should be replaced with the actual
            terms governing use of this website and any products or services offered by
            Perfect Industrial Solution.
          </p>
          <p>
            Please consult your organization&apos;s legal team to finalize this page before
            the site goes live.
          </p>
        </div>
      </section>
    </>
  );
}
