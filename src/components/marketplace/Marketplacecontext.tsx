"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useFavorites } from "@/hooks/useFavorites";

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  sizes?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
  selectedSize?: string;
}

interface MarketplaceContextValue {
  cart: CartItem[];
  wishlist: number[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: number, size?: string) => void;
  updateCartQuantity: (productId: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  cartTotal: number;
  cartCount: number;
}

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

const CART_KEY = "marketplace_cart_v1";

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const { isFavorited, toggleFavorite, favoritedIds } = useFavorites();

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) setCart(JSON.parse(savedCart));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, hydrated]);

  // 🔥 FIX IMPORTANT: productId + size unique
  const addToCart = (product: Product, quantity = 1, size?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.selectedSize === size,
      );

      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.selectedSize === size
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stock),
          selectedSize: size,
        },
      ];
    });
  };

  const removeFromCart = (productId: number, size?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedSize === size)),
    );
  };

  const updateCartQuantity = (productId: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedSize === size
          ? {
              ...item,
              quantity: Math.min(quantity, item.product.stock),
            }
          : item,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const wishlist = favoritedIds("product");
  const toggleWishlist = (productId: number) => {
    toggleFavorite("product", productId);
  };
  const isWishlisted = (productId: number) => isFavorited("product", productId);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MarketplaceContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used within MarketplaceProvider");
  return ctx;
}
