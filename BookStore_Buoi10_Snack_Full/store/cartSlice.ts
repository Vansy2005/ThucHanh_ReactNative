import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book, CartItem } from "../types";
import type { RootState } from "./index";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as CartItem[] },
  reducers: {
    addToCart(state, action: PayloadAction<Pick<Book, "id" | "title" | "price">>) {
      const { id, title, price } = action.payload;
      const found = state.items.find((i) => i.bookId === id);
      if (found) found.quantity += 1; // Immer cho phép viết như sửa trực tiếp
      else state.items.push({ bookId: id, title, price, quantity: 1 });
    },
    decrease(state, action: PayloadAction<string>) {
      const found = state.items.find((i) => i.bookId === action.payload);
      if (!found) return;
      if (found.quantity > 1) found.quantity -= 1;
      else state.items = state.items.filter((i) => i.bookId !== action.payload);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.bookId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, decrease, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartCount = (s: RootState) => s.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectCartTotal = (s: RootState) => s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
