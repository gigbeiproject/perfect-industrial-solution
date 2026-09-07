import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const [
    products,
    heroSlides,
    blogPosts,
    inquiries,
    newInquiries,
    contactMessages,
    newContactMessages,
  ] = await Promise.all([
    query("SELECT COUNT(*) AS count FROM products"),
    query("SELECT COUNT(*) AS count FROM hero_slides"),
    query("SELECT COUNT(*) AS count FROM blog_posts"),
    query("SELECT COUNT(*) AS count FROM product_inquiries"),
    query("SELECT COUNT(*) AS count FROM product_inquiries WHERE status = 'New'"),
    query("SELECT COUNT(*) AS count FROM contact_messages"),
    query("SELECT COUNT(*) AS count FROM contact_messages WHERE status = 'New'"),
  ]);

  return NextResponse.json({
    totalProducts: products[0].count,
    totalHeroSlides: heroSlides[0].count,
    totalBlogPosts: blogPosts[0].count,
    totalInquiries: inquiries[0].count,
    newInquiries: newInquiries[0].count,
    totalContactMessages: contactMessages[0].count,
    newContactMessages: newContactMessages[0].count,
  });
}
