import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";

// Lazy load everything below the fold
const FeatureHighlights = lazy(() => import("@/components/FeatureHighlights"));
const ProductGrid = lazy(() => import("@/components/ProductGrid"));
const Footer = lazy(() => import("@/components/Footer"));

// Lightweight skeleton shown while lazy sections load
const SectionSkeleton = () => (
  <div className="py-16 flex items-center justify-center">
    <span className="text-4xl text-gold animate-pulse">ॐ</span>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroBanner />
        {/* Only Hero Banner is shown here, Footer is below */}
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
