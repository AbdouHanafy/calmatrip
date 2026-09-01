"use client";
import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import type { Product } from "@/components/marketplace/Marketplacecontext";
import { useAdminProducts } from "@/hooks/admin/useAdminProducts";
import {
  CollectionList,
  type CollectionColumn,
} from "@/components/admin/collection/CollectionList";
import { DeleteConfirmModal } from "@/components/admin/collection/DeleteConfirmModal";
import { parseImages } from "@/components/admin/products/types";
import { isUnlimitedStock } from "@/lib/products";

export default function AdminProductsPage() {
  const { products, loading, search, setSearch, saving, deleteProduct } = useAdminProducts();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Product | null>(null);

  const columns: CollectionColumn<Product>[] = [
    {
      key: "product",
      label: "Product",
      render: (p) => {
        const images = parseImages(p.image);
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-calma-sand">
              <Image
                src={images[0] || "/placeholder-product.png"}
                alt={p.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-calma-ink">{p.name}</span>
          </div>
        );
      },
    },
    {
      key: "category",
      label: "Category",
      render: (p) => <span className="text-sm text-calma-taupe">{p.category}</span>,
    },
    {
      key: "sizes",
      label: "Sizes",
      render: (p) => (
        <span className="text-sm text-calma-taupe">
          {Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes.join(", ") : "—"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (p) => <span className="font-semibold text-admin-gold">{p.price} TND</span>,
    },
    {
      key: "stock",
      label: "Stock",
      render: (p) => (
        <span className={`font-semibold ${p.stock > 0 ? "text-calma-success" : "text-red-500"}`}>
          {isUnlimitedStock(p.stock) ? "Illimité" : p.stock}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-fraunces text-2xl font-normal text-calma-ink">Products</h1>
        <p className="mt-1 text-calma-taupe">Manage the marketplace catalog and stock</p>
      </div>

      <CollectionList
        items={products}
        getId={(p) => p.id}
        columns={columns}
        loading={loading}
        searchTerm={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search a product..."
        getRowHref={(p) => `/admin/marketplace/products/${p.id}`}
        createHref="/admin/marketplace/products/new"
        createLabel="New product"
        onDeleteRequest={setShowDeleteConfirm}
        emptyIcon={Package}
        emptyTitle="No products found"
        emptySub="Try a different search."
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          itemLabel={showDeleteConfirm.name}
          isDeleting={saving}
          onCancel={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            deleteProduct(showDeleteConfirm.id);
            setShowDeleteConfirm(null);
          }}
        />
      )}
    </div>
  );
}
