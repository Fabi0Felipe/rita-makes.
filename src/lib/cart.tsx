import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = { id: string; qty: number };

export type CustomerInfo = {
  name: string;
  address: string;
  district: string;
  number: string;
  complement: string;
  reference: string;
  phone: string;
};

export const EMPTY_CUSTOMER: CustomerInfo = {
  name: "",
  address: "",
  district: "",
  number: "",
  complement: "",
  reference: "",
  phone: "",
};

const LINES_KEY = "ritamakes.cart.v1";
const CUSTOMER_KEY = "ritamakes.customer.v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  bump: number;
  customer: CustomerInfo;
  setCustomer: (patch: Partial<CustomerInfo>) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [customer, setCustomerState] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [hydrated, setHydrated] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    setLines(read<CartLine[]>(LINES_KEY, []));
    setCustomerState({ ...EMPTY_CUSTOMER, ...read<Partial<CustomerInfo>>(CUSTOMER_KEY, {}) });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(LINES_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  }, [customer, hydrated]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id, qty }];
    });
    setBump((b) => b + 1);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const setCustomer = useCallback((patch: Partial<CustomerInfo>) => {
    setCustomerState((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      hydrated,
      bump,
      customer,
      setCustomer,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, hydrated, bump, customer, setCustomer, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
