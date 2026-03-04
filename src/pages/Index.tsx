import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";

// Lazy load everything below the fold
const FeatureHighlights = lazy(() => import("@/components/FeatureHighlights"));
const ProductGrid = lazy(() => import("@/components/ProductGrid"));
const LimitedEditionDrops = lazy(() => import("@/components/LimitedEditionDrops"));
const FestivalCollections = lazy(() => import("@/components/FestivalCollections"));
const BridalPlanning = lazy(() => import("@/components/BridalPlanning"));
const RewardsProgram = lazy(() => import("@/components/RewardsProgram"));
const CommunitySection = lazy(() => import("@/components/CommunitySection"));
const SmartFeatures = lazy(() => import("@/components/SmartFeatures"));
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
        <Suspense fallback={<SectionSkeleton />}>
          <FeatureHighlights />
          <ProductGrid />
          <LimitedEditionDrops />
          <FestivalCollections />
          <BridalPlanning />
          <RewardsProgram />
          <CommunitySection />
          <SmartFeatures />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
