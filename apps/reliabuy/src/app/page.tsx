import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import { computeTrustFactor } from "@/server/trust-model";
import { verifyToken } from "@/server/verify-token";

export default async function Home() {
  const isLoggedIn = await verifyToken();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <ProductCarousel type={isLoggedIn?.type as string} />
    </div>
  );
}
