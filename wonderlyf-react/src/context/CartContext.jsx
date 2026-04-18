import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import {
  isWooConfigured,
  getCart as wooGetCart,
  addToCart as wooAddToCart,
  updateCartItem as wooUpdateItem,
  removeCartItem as wooRemoveItem,
  clearWooCart,
} from "../lib/woo";

const CartContext = createContext(null);

const LOCAL_KEY = "wonderlyf-cart";

// ─── Local-only fallback (when Woo isn't configured) ────────────────────
function getInitialLocal() {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function localReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, quantity, selectedWeight, selectedPrice } = action.payload;
      const key = `${product.id}-${selectedWeight}`;
      const existing = state.find((i) => i.key === key);
      if (existing) {
        return state.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...state, { ...product, key, quantity, selectedWeight, selectedPrice }];
    }
    case "UPDATE": {
      const { key, quantity } = action.payload;
      if (quantity <= 0) return state.filter((i) => i.key !== key);
      return state.map((i) => (i.key === key ? { ...i, quantity } : i));
    }
    case "REMOVE":
      return state.filter((i) => i.key !== action.payload);
    case "SET":
      return action.payload;
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// Map a Woo Store API cart item → our cart-item shape
function mapWooItem(i) {
  const weightAttr = i.variation?.find((v) =>
    String(v.attribute).toLowerCase().includes("weight")
  );
  return {
    key: i.key,
    id: i.id,
    name: i.name,
    image: i.images?.[0]?.thumbnail || i.images?.[0]?.src || "",
    category: i.categories?.[0]?.name || "",
    quantity: i.quantity,
    selectedWeight: weightAttr?.value || "",
    selectedPrice: Number(i.prices?.price || 0) / 100,
  };
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(localReducer, null, getInitialLocal);

  useEffect(() => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(cart)); } catch {}
  }, [cart]);

  // Hydrate from Woo on mount — but only adopt Woo's cart if it has items.
  const refreshCart = useCallback(async () => {
    if (!isWooConfigured) return;
    try {
      const wc = await wooGetCart();
      const items = (wc.items || []).map(mapWooItem);
      if (items.length > 0) dispatch({ type: "SET", payload: items });
    } catch (e) {
      console.warn("Woo cart sync failed:", e.message);
    }
  }, []);

  useEffect(() => { refreshCart(); }, [refreshCart]);

  // Local state is the source of truth for UI. Woo sync is best-effort.
  const addItem = (product, quantity = 1, selectedWeight, selectedPrice) => {
    const weight = selectedWeight || product.weight || "";
    const price = selectedPrice || product.price;

    const variant = product.productType === "variable"
      ? product.variants?.find((v) => v.weight === weight)
      : null;
    const purchasableId = variant?.id || product.id;

    dispatch({
      type: "ADD",
      payload: {
        product: { ...product, purchasableId },
        quantity,
        selectedWeight: weight,
        selectedPrice: price,
      },
    });

    if (!isWooConfigured) return;
    (async () => {
      try { await wooAddToCart(purchasableId, quantity, []); }
      catch (e) { console.warn("Woo add-to-cart sync failed (keeping local):", e.message); }
    })();
  };

  const updateQuantity = (key, quantity) => {
    dispatch({ type: "UPDATE", payload: { key, quantity } });
    if (!isWooConfigured) return;
    (async () => {
      try {
        if (quantity <= 0) await wooRemoveItem(key);
        else await wooUpdateItem(key, quantity);
      } catch (e) { console.warn("Woo update sync failed (keeping local):", e.message); }
    })();
  };

  const removeItem = (key) => {
    dispatch({ type: "REMOVE", payload: key });
    if (!isWooConfigured) return;
    (async () => {
      try { await wooRemoveItem(key); }
      catch (e) { console.warn("Woo remove sync failed (keeping local):", e.message); }
    })();
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR" });
    if (!isWooConfigured) return;
    (async () => {
      try { await clearWooCart(); }
      catch (e) { console.warn("Woo clear sync failed:", e.message); }
    })();
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.selectedPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
        cartCount,
        cartTotal,
        wooEnabled: isWooConfigured,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
