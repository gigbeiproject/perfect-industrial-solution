import { query } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await query(
    "SELECT id, name FROM product_categories ORDER BY sort_order ASC, name ASC"
  );

  return (
    <div>
      <p className="mb-5 text-sm text-muted">Create a new product for the catalog.</p>
      <ProductForm mode="new" categories={categories} />
    </div>
  );
}
