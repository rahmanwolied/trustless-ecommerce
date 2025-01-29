import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const products = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 79.99,
    rating: 4.5,
    purchases: 1200,
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi5.walmartimages.com%2Fasr%2F01f45e55-1e7d-4b2c-9983-abd6499b8e68_1.42b65de79c231959bc7711ac356b69fb.jpeg%3FodnWidth%3D1000%26odnHeight%3D1000%26odnBg%3Dffffff&f=1&nofb=1&ipt=9d10b477195b94a24af374fba510bd43f90847a9396814f508853d5f195a7f0b&ipo=images",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    rating: 4.2,
    purchases: 800,
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.bhphotovideo.com%2Fimages%2Fimages2500x2500%2Fapple_mj3t2ll_a_watch_sport_smartwatch_42mm_1187199.jpg&f=1&nofb=1&ipt=464831fc78445c2b88d7d8eaab0a0151fef9e2e9c41d6d7662a874c27248de9d&ipo=images",
  },
  {
    id: 3,
    name: "Portable Charger",
    price: 49.99,
    rating: 4.7,
    purchases: 2000,
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.SlCgYz4cbcWq2FY3hqIr7gHaH8%26pid%3DApi&f=1&ipt=3d85e3472aacb38dd481b1a3e7b53224b3a17ba614266c53fb08b0ca5f09fc24&ipo=images",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi5.walmartimages.com%2Fasr%2Fcdaaab64-5ea7-4d8f-969f-cff666244723.ff62693361b001ebbaf41145d23c0f13.jpeg&f=1&nofb=1&ipt=f24336124edc38de6b345de077188d60d4fe17e1aad8c050528cfd42d412987d&ipo=images",
    price: 89.99,
    rating: 4.3,
    purchases: 1500,
  },
];

export default function ProductCarousel() {
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
              <p className="mt-4 text-2xl font-bold">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Details</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                    <DialogDescription>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400" />
                          <span className="ml-1 text-sm">{product.rating}</span>
                        </div>
                        <p>Purchased {product.purchases} times</p>
                        <p className="text-2xl font-bold">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <Button
                    className="mt-4 w-full"
                    onClick={() => alert("Added to cart!")}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                  </Button>
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
