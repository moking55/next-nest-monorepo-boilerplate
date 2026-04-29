"use client";

import { useEffect } from "react";
import useProducts from "@/hooks/use-products";

export default function ProductContainer() {
  const { products, loading, error, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="font-semibold">{product.name}</h2>
            {product.description && (
              <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            )}
            <p className="text-lg font-bold mt-2">
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
