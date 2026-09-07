import Image from "next/image";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-border-muted bg-white card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface">
        {product.main_image_url ? (
          <Image
            src={product.main_image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="text-muted" size={36} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.category_name && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-brand">
            {product.category_name}
          </span>
        )}
        <h3 className="mt-1 text-sm font-bold text-ink group-hover:text-brand md:text-base">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-xs text-muted">{product.short_description}</p>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand">
          View Details <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}
