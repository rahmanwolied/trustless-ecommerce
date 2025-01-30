import { prisma } from "@repo/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Props {
  params: {
    "seller-id": string;
  };
}

export default async function SellerProfile({ params }: Props) {
  const seller = await prisma.seller.findUnique({
    where: {
      id: params["seller-id"],
    },
    include: {
      products: true,
    },
  });

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Seller not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="mb-8 bg-background/50 backdrop-blur-sm border border-primary/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold neon-text">
            {seller.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-lg">
                Trust score: {seller.trustFactor.toFixed(2)} %
              </span>
            </div>
            <Progress value={seller.trustFactor} />
            <p className="text-lg text-muted-foreground">
              Address: {seller.address}
            </p>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-6 neon-text">Listed Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {seller.products.map((product) => (
          <Card
            key={product.id}
            className="bg-background/50 backdrop-blur-sm border border-primary/20 hover-neon"
          >
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span>{product.rating}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Purchased {product.purchases} times
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
