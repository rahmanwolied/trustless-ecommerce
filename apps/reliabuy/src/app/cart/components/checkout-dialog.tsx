"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { checkout } from "@/server/checkout";
import { useState } from "react";
import { showToast } from "@/lib/toast";
import Payment from "./payment";
import { useConnectionIdAtom } from "@/lib/atoms/connection-id-atom";
import { sendReceiptOffer } from "@repo/ssi";
import { Loader2 } from "lucide-react";
import { updateTrustFactor } from "@/server/trust-model";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
}

interface CheckoutDialogProps {
  children: React.ReactNode;
  cartItems: CartItem[];
}
type PaymentStatus = "idle" | "processing" | "success";

export function CheckoutDialog({ children, cartItems }: CheckoutDialogProps) {
  const [connectionId] = useConnectionIdAtom();
  const [open, setOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const sellerId = cartItems[0]?.sellerId || "";

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setPaymentStatus("processing");
      // Create purchase record
      const result = await checkout(subtotal, sellerId);

      if (result.success) {
        // Clear cart
        localStorage.setItem("cart", "[]");
        showToast.success(
          result.message,
          "You should be getting your receipt VC soon"
        );

        await updateTrustFactor(sellerId);

        if (connectionId) {
          const receipt = {
            receipt_number: result.data.id,
            receipt_date: result.data.tTime.toISOString(),
            receipt_amount: result.data.amount.toString(),
          };
          showToast.promise(
            "Sending receipt offer...",
            "Receipt offer sent successfully",
            "Failed to send receipt offer",
            sendReceiptOffer({ ...receipt, connectionId })
          );
        }
        setPaymentStatus("success");
      } else {
        showToast.error(result.message);
        setPaymentStatus("idle");
      }

      setOpen(false);
    } catch (error) {
      console.error("Checkout error:", error);
      setPaymentStatus("idle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Payment
          cartItems={cartItems}
          subtotal={subtotal}
          paymentStatus={paymentStatus}
        />
        <DialogFooter>
          <Button
            onClick={handleCheckout}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="flex items-center">Processing...</span>
              </>
            ) : (
              "Pay Now"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
