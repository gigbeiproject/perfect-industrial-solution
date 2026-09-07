import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { query, queryOne } from "@/lib/db";
import { linesToArray } from "@/lib/utils";
import PageHeader from "@/components/ui/PageHeader";
import ProductGallery from "@/components/products/ProductGallery";
import ProductInquiryForm from "@/components/products/ProductInquiryForm";
import ProductCard from "@/components/products/ProductCard";

async function getProduct(slug) {
  const product = await queryOne(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM products p
     LEFT JOIN product_categories c ON c.id = p.category_id
     WHERE p.slug = ? AND p.status = 1 LIMIT 1`,
    [slug]
  );
  if (!product) return null;

  const [images, related] = await Promise.all([
    query(
      "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
      [product.id]
    ),
    product.category_id
      ? query(
          `SELECT p.*, c.name AS category_name FROM products p
           LEFT JOIN product_categories c ON c.id = p.category_id
           WHERE p.category_id = ? AND p.id != ? AND p.status = 1
           ORDER BY p.sort_order ASC LIMIT 4`,
          [product.category_id, product.id]
        )
      : [],
  ]);

  return { product, images: images.map((i) => i.image_url), related };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await queryOne(
    "SELECT name, short_description FROM products WHERE slug = ? AND status = 1 LIMIT 1",
    [slug]
  );
  if (!product) return {};
  return {
    title: product.name,
    description: product.short_description || product.name,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) notFound();

  const { product, images, related } = data;
  const gallery = product.main_image_url ? [product.main_image_url, ...images] : images;

  const features = linesToArray(product.features);
  const specifications = linesToArray(product.specifications);
  const applications = linesToArray(product.applications);

  return (
    <>
      <PageHeader
        title={product.name}
        crumbs={[
          { label: "Products", href: "/products" },
          ...(product.category_name
            ? [{ label: product.category_name, href: `/products?category=${product.category_slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <section className="section-py bg-white">
        <div className="container-px grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery images={gallery} productName={product.name} />

          <div>
            {product.category_name && (
              <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                {product.category_name}
              </span>
            )}
            <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{product.name}</h1>
            {product.short_description && (
              <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                {product.short_description}
              </p>
            )}

            {features.length > 0 && (
              <ul className="mt-6 space-y-2.5">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <ProductInquiryForm productId={product.id} productName={product.name} />
            </div>
          </div>
        </div>

        <div className="container-px mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {product.description && (
            <div className={specifications.length || applications.length ? "lg:col-span-2" : "lg:col-span-3"}>
              <h2 className="text-lg font-extrabold text-ink md:text-xl">Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">
                {product.description}
              </p>

              {applications.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-extrabold text-ink md:text-xl">Applications</h2>
                  <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {applications.map((app, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" />
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {specifications.length > 0 && (
            <div>
              <h2 className="text-lg font-extrabold text-ink md:text-xl">Specifications</h2>
              <dl className="mt-3 divide-y divide-border-muted rounded-sm border border-border-muted">
                {specifications.map((spec, i) => {
                  const [key, ...rest] = spec.split(":");
                  const value = rest.join(":").trim();
                  return (
                    <div key={i} className="flex justify-between gap-4 px-4 py-3 text-sm">
                      <dt className="font-semibold text-ink">{key}</dt>
                      {value && <dd className="text-right text-muted">{value}</dd>}
                    </div>
                  );
                })}
              </dl>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-py bg-surface">
          <div className="container-px">
            <h2 className="text-xl font-extrabold text-ink md:text-2xl">Related Products</h2>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
