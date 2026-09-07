import Link from "next/link";
import { Boxes } from "lucide-react";
import { query } from "@/lib/db";
import { getCompanySettings } from "@/lib/settings";
import PageHeader from "@/components/ui/PageHeader";
import ProductCard from "@/components/products/ProductCard";

export async function generateMetadata() {
  const settings = await getCompanySettings();
  return {
    title: "Products",
    description: `Browse the full range of industrial products offered by ${settings.company_name}.`,
  };
}

async function getProducts(categorySlug) {
  const categories = await query(
    "SELECT * FROM product_categories WHERE status = 1 ORDER BY sort_order ASC, id ASC"
  );

  let products;
  if (categorySlug) {
    products = await query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p
       LEFT JOIN product_categories c ON c.id = p.category_id
       WHERE p.status = 1 AND c.slug = ?
       ORDER BY p.sort_order ASC, p.id DESC`,
      [categorySlug]
    );
  } else {
    products = await query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p
       LEFT JOIN product_categories c ON c.id = p.category_id
       WHERE p.status = 1
       ORDER BY p.sort_order ASC, p.id DESC`
    );
  }

  return { categories, products };
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const activeCategory = params?.category || "";
  const { categories, products } = await getProducts(activeCategory);

  return (
    <>
      <PageHeader title="Our Products" crumbs={[{ label: "Products" }]} />

      <section className="section-py bg-white">
        <div className="container-px">
          {categories.length > 0 && (
            <div className="mb-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors sm:text-sm ${
                  !activeCategory
                    ? "border-brand bg-brand text-white"
                    : "border-border-muted text-ink hover:border-brand hover:text-brand"
                }`}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wide transition-colors sm:text-sm ${
                    activeCategory === cat.slug
                      ? "border-brand bg-brand text-white"
                      : "border-border-muted text-ink hover:border-brand hover:text-brand"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 text-center text-muted">
              <Boxes size={40} className="mb-4 text-border-muted" />
              <p className="text-lg font-semibold text-ink">No products found</p>
              <p className="mt-1 text-sm">
                Products in this category will appear here once added from the admin panel.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
