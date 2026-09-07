import { query, queryOne } from "@/lib/db";
import { getCompanySettings } from "@/lib/settings";
import HeroSlider from "@/components/home/HeroSlider";
import AboutSection from "@/components/home/AboutSection";
import ProductsSection from "@/components/home/ProductsSection";
import GallerySection from "@/components/home/GallerySection";
import BlogSection from "@/components/home/BlogSection";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustedClients from "@/components/home/TrustedClients";
import ContactCTA from "@/components/home/ContactCTA";

async function getHomeData() {
  const [heroSlides, about, features, products, gallery, posts, testimonials, clients] =
    await Promise.all([
      query(
        "SELECT * FROM hero_slides WHERE status = 1 ORDER BY sort_order ASC, id ASC"
      ),
      queryOne("SELECT * FROM about_sections ORDER BY id ASC LIMIT 1"),
      query(
        "SELECT * FROM about_features WHERE status = 1 ORDER BY sort_order ASC, id ASC"
      ),
      query(
        `SELECT p.*, c.name AS category_name FROM products p
         LEFT JOIN product_categories c ON c.id = p.category_id
         WHERE p.status = 1 ORDER BY p.sort_order ASC, p.id DESC LIMIT 4`
      ),
      query(
        "SELECT * FROM gallery WHERE status = 1 ORDER BY sort_order ASC, id ASC LIMIT 8"
      ),
      query(
        "SELECT * FROM blog_posts WHERE status = 1 ORDER BY created_at DESC LIMIT 3"
      ),
      query(
        "SELECT * FROM testimonials WHERE status = 1 ORDER BY sort_order ASC, id ASC"
      ),
      query(
        "SELECT * FROM trusted_clients WHERE status = 1 ORDER BY sort_order ASC, id ASC"
      ),
    ]);

  return { heroSlides, about, features, products, gallery, posts, testimonials, clients };
}

export default async function HomePage() {
  const [
    { heroSlides, about, features, products, gallery, posts, testimonials, clients },
    settings,
  ] = await Promise.all([getHomeData(), getCompanySettings()]);

  return (
    <>
      <HeroSlider slides={heroSlides} yearsExperience={settings.years_experience} />
      <AboutSection about={about} features={features} />
      <ProductsSection products={products} />
      <GallerySection items={gallery} />
      <StatsSection settings={settings} />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSection posts={posts} />
      <TrustedClients clients={clients} />
      <ContactCTA settings={settings} />
    </>
  );
}
