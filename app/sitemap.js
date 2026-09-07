import { query } from "@/lib/db";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticRoutes = ["", "/about-us", "/products", "/blog", "/contact-us"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  let productRoutes = [];
  let blogRoutes = [];
  try {
    const products = await query(
      "SELECT slug, updated_at FROM products WHERE status = 1"
    );
    productRoutes = products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    }));

    const posts = await query(
      "SELECT slug, updated_at FROM blog_posts WHERE status = 1"
    );
    blogRoutes = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    }));
  } catch {
    // DB unavailable at build time — sitemap still returns static routes.
  }

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
