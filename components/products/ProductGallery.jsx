"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

export default function ProductGallery({ images, productName }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : [];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-border-muted bg-surface">
        {list.length > 0 ? (
          <Image
            src={list[active]}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="text-muted" size={48} />
          </div>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {list.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-square overflow-hidden rounded-sm border transition-colors ${
                index === active ? "border-brand" : "border-border-muted hover:border-brand/50"
              }`}
            >
              <Image src={src} alt={`${productName} ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
