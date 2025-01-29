import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <ProductCarousel />
    </div>
  );
}
