import Image from "next/image";
import Link from "next/link";
import { Newspaper, ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-border-muted bg-white card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
        {post.featured_image_url ? (
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Newspaper className="text-muted" size={32} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          <Calendar size={12} /> {formatDate(post.created_at)}
        </span>
        <h3 className="mt-2 text-base font-bold text-ink group-hover:text-brand">{post.title}</h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">
          Read More <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}
