"use client";

import { showToast } from "@/lib/toast";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@repo/db";
import { DialogClose } from "@/components/ui/dialog";

export function AddToCartBtn({
  product,
  type,
}: {
  product: Product;
  type: string;
}) {
  return (
    <DialogClose
      className="mt-4 w-1/2 bg-blue-500 text-white rounded-md p-2 flex justify-center items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={type === "seller" || !type}
      onClick={() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingItem = cart.find((item: any) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            sellerId: product.sellerId,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        showToast.success("Added to cart!");
      }}
    >
      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
    </DialogClose>
  );
}
