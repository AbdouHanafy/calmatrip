import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/components/marketplace/Marketplacecontext";
import { parseImages } from "./types";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
  onQuickStockUpdate: (id: number, stock: number) => void;
}

export function ProductsTable({
  products,
  loading,
  onEdit,
  onDelete,
  onQuickStockUpdate,
}: ProductsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-calma-border shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-calma-border text-left text-calma-taupe">
            <th className="px-4 py-3 font-medium">Produit</th>
            <th className="px-4 py-3 font-medium">Catégorie</th>
            <th className="px-4 py-3 font-medium">Tailles</th>
            <th className="px-4 py-3 font-medium">Prix</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-calma-taupe">
                Chargement...
              </td>
            </tr>
          ) : products.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-calma-taupe">
                Aucun produit
              </td>
            </tr>
          ) : (
            products.map((p) => {
              const images = parseImages(p.image);
              return (
                <tr key={p.id} className="border-b border-calma-border hover:bg-calma-sand/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-calma-sand overflow-hidden shrink-0">
                        <Image
                          src={images[0] || "/placeholder-product.png"}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                        {images.length > 1 && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F2994A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            +{images.length - 1}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-calma-ink line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-calma-taupe capitalize">{p.category}</td>
                  <td className="px-4 py-3">
                    {Array.isArray(p.sizes) && p.sizes.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {p.sizes.map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-calma-sand text-calma-taupe text-xs font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-calma-taupe text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-calma-ink font-medium">{p.price.toFixed(2)} TND</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={p.stock}
                      onBlur={(e) => {
                        const v = parseInt(e.target.value);
                        if (!isNaN(v) && v !== p.stock) onQuickStockUpdate(p.id, v);
                      }}
                      className={`w-20 px-2 py-1 rounded-lg border text-sm ${
                        p.stock <= 5
                          ? "border-red-300 text-red-600 bg-red-50"
                          : "border-calma-border"
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        aria-label={`Modifier ${p.name}`}
                        className="p-2 rounded-lg hover:bg-calma-sand text-calma-taupe"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        aria-label={`Supprimer ${p.name}`}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
