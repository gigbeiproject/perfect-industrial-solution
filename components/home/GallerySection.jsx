import Image from "next/image";
import { Images } from "lucide-react";

export default function GallerySection({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section id="gallery" className="section-py bg-white scroll-mt-32">
      <div className="container-px">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow mb-2 flex items-center justify-center gap-2">
            <Images size={16} /> Gallery
          </p>
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl md:text-4xl">
            A Look Inside Our <span className="text-brand">Operations</span>
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-sm card-shadow"
            >
              <Image
                src={item.image_url}
                alt={item.title || "Gallery image"}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {item.title && (
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-xs font-semibold text-white">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
