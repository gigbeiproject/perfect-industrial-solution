import PageHeader from "@/components/ui/PageHeader";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]} />
      <section className="section-py bg-white">
        <div className="container-px max-w-3xl mx-auto space-y-5 text-sm leading-relaxed text-muted md:text-base">
          <p>
            This placeholder Privacy Policy should be replaced with content that accurately
            reflects how Perfect Industrial Solution collects, uses and protects information
            submitted through this website, including contact and product inquiry forms.
          </p>
          <p>
            Please consult your organization&apos;s legal or compliance team to finalize this
            page before the site goes live.
          </p>
        </div>
      </section>
    </>
  );
}
