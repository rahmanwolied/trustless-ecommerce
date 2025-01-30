import React from "react";
import { Button } from "../../components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Star } from "lucide-react";
import { showToast } from "../../lib/toast";
import { prisma } from "@repo/db";
import { verifyToken } from "@/server/verify-token";
import { redirect } from "next/navigation";
import ReviewDialog from "./components/review-dialog";
import { Status } from "@repo/db";

export default async function OrdersPage() {
  const token = await verifyToken();
  if (!token) {
    return redirect("/login");
  }
  const orders = await prisma.purchase.findMany({
    where: {
      buyerFirstName: token.name as string,
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 neon-text text-center">
        My Orders
      </h1>

      <div className="bg-background/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {new Date(order.tTime).toLocaleDateString()}
                </TableCell>
                <TableCell>${order.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span className="text-green-600 font-semibold">
                    {order.status || "Delivered"}
                  </span>
                </TableCell>
                <TableCell>
                  <ReviewDialog order={order} sellerId={order.sellerId}>
                    <Button variant="outline">Review</Button>
                  </ReviewDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
