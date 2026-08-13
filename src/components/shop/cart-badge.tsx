"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";

export function CartBadge() {
  const count = useCart((state) => state.boxes.length);
  const [mounted, setMounted] = useState(false);

  // Avoid a hydration mismatch: the persisted cart only exists client-side.
  useEffect(() => setMounted(true), []);

  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-medium text-cream-50">
      {count}
    </span>
  );
}
