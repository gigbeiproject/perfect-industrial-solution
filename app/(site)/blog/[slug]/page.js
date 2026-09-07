import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { query, queryOne } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import BlogCard from "@/components/home/BlogCard";

async function getPost(slug) {
  const post = await queryOne(
    "SELECT * FROM blog_posts WHERE slug = ? AND status = 1 LIMIT 1",
    [slug]
  );
  if (!post) return null;

  const related = await query(
    "SELECT * FROM blog_posts WHERE status = 1 AND id != ? ORDER BY created_at DESC LIMIT 3",
    [post.id]
  );

  return { post, related };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await queryOne(
    "SELECT title, excerpt FROM blog_posts WHERE slug = ? AND status = 1 LIMIT 1",
    [slug]
  );
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt || post.title,
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const data = await getPost(slug);
  if (!data) notFound();

  const { post, related } = data;

  return (
    <>
      <PageHeader
        title={post.title}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />

      <section className="section-py bg-white">
        <div className="container-px mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wide text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {formatDate(post.created_at)}
            </span>
            {post.author && (
              <span className="flex items-center gap-1.5">
                <User size={14} /> {post.author}
              </span>
            )}
          </div>

          {post.featured_image_url && (
            <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-sm card-shadow">
              <Image
                src={post.featured_image_url}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-8 whitespace-pre-line text-sm leading-relaxed text-ink md:text-base">
            {post.content}
          </div>

          <Link
            href="/blog"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-py bg-surface">
          <div className="container-px">
            <h2 className="text-xl font-extrabold text-ink md:text-2xl">More Articles</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
