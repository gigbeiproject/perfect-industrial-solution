import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";

export default function ProductsSection({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="section-py bg-white">
      <div className="container-px">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2">Our Products</p>
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl md:text-4xl">
              High-Quality Industrial Products For Every Need
            </h2>
          </div>
          <Link href="/products" className="btn-primary shrink-0">
            View All Products
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
