import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddToCartBtn } from "./add-to-cart-btn";
import { prisma } from "@repo/db";
import Link from "next/link";

export default async function ProductCarousel({
  type,
}: {
  type: string | null;
}) {
  const products = await prisma.product.findMany({});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 neon-text">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="w-full hover:shadow-md transition-shadow duration-300 bg-background/50 backdrop-blur-sm border border-primary/20 hover-neon"
          >
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-4 text-2xl font-bold">
                ${product.price.toFixed(2)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="ml-1 text-sm">{product.rating}</span>
                        </div>
                        <div>Purchased {product.purchases} times</div>
                        <Link href={`/seller/${product.sellerId}`}>
                          <Button variant="outline">View Seller</Button>
                        </Link>
                        <div className="text-2xl font-bold">
                          ${product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </DialogHeader>

                  <AddToCartBtn product={product} type={type || ""} />
                </DialogContent>
              </Dialog>
              <Badge variant="secondary">{product.rating} ★</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
