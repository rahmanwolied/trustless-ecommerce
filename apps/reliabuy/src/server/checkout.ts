"use server";

import { prisma } from "@repo/db";
import { verifyToken } from "./verify-token";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export async function checkout(subtotal: number, sellerId: string) {
  try {
    const token = await verifyToken();
    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        buyerFirstName: (token?.name as string) || "Anonymous", // Replace with actual buyer name from auth
        amount: subtotal,
        star: 0,
        picture: "",
        video: "",
        review: "",
        sellerId: sellerId,
      },
    });

    return {
      success: true as const,
      message: "Purchase successful",
      data: purchase,
    };
  } catch (error) {
    return {
      success: false as const,
      message: "Failed to create purchase",
    };
  }
}
