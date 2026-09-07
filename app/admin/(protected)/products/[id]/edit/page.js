import { notFound } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    queryOne("SELECT * FROM products WHERE id = ?", [id]),
    query("SELECT id, name FROM product_categories ORDER BY sort_order ASC, name ASC"),
  ]);

  if (!product) notFound();

  const images = await query(
    "SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC",
    [id]
  );

  return (
    <div>
      <p className="mb-5 text-sm text-muted">Editing: {product.name}</p>
      <ProductForm mode="edit" categories={categories} initialProduct={{ ...product, images }} />
    </div>
  );
}
