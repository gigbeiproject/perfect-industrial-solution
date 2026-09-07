import { Newspaper } from "lucide-react";
import { query } from "@/lib/db";
import { getCompanySettings } from "@/lib/settings";
import PageHeader from "@/components/ui/PageHeader";
import BlogCard from "@/components/home/BlogCard";

export async function generateMetadata() {
  const settings = await getCompanySettings();
  return {
    title: "Blog",
    description: `Industry news, updates and insights from ${settings.company_name}.`,
  };
}

export default async function BlogPage() {
  const posts = await query(
    "SELECT * FROM blog_posts WHERE status = 1 ORDER BY created_at DESC"
  );

  return (
    <>
      <PageHeader title="Blog" crumbs={[{ label: "Blog" }]} />

      <section className="section-py bg-white">
        <div className="container-px">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 text-center text-muted">
              <Newspaper size={40} className="mb-4 text-border-muted" />
              <p className="text-lg font-semibold text-ink">No blog posts yet</p>
              <p className="mt-1 text-sm">Articles will appear here once published from the admin panel.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
