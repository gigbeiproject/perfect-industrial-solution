import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/home/BlogCard";

export default function BlogSection({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="section-py bg-surface scroll-mt-32">
      <div className="container-px">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2">From Our Blog</p>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl md:text-4xl">
              Latest News &amp; Insights
            </h2>
          </div>
          <Link href="/blog" className="btn-primary shrink-0">
            View All Posts
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
