import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartFlavorPick = {
  flavorId: string;
  name: string;
  quantity: number;
};

export type CartBox = {
  cartItemId: string;
  boxSizeId: string;
  boxSizeName: string;
  cookieCount: number;
  unitPrice: number;
  flavors: CartFlavorPick[];
};

type CartState = {
  boxes: CartBox[];
  addBox: (box: Omit<CartBox, "cartItemId">) => void;
  removeBox: (cartItemId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      boxes: [],
      addBox: (box) =>
        set((state) => ({
          boxes: [
            ...state.boxes,
            { ...box, cartItemId: crypto.randomUUID() },
          ],
        })),
      removeBox: (cartItemId) =>
        set((state) => ({
          boxes: state.boxes.filter((b) => b.cartItemId !== cartItemId),
        })),
      clear: () => set({ boxes: [] }),
    }),
    { name: "bsc-cart" }
  )
);

export function cartTotal(boxes: CartBox[]): number {
  return boxes.reduce((sum, box) => sum + box.unitPrice, 0);
}

export function cartCount(boxes: CartBox[]): number {
  return boxes.length;
}
