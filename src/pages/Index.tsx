import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import FeatureHighlights from "@/components/FeatureHighlights";
import ProductGrid from "@/components/ProductGrid";
import LimitedEditionDrops from "@/components/LimitedEditionDrops";
import FestivalCollections from "@/components/FestivalCollections";
import BridalPlanning from "@/components/BridalPlanning";
import RewardsProgram from "@/components/RewardsProgram";
import CommunitySection from "@/components/CommunitySection";
import SmartFeatures from "@/components/SmartFeatures";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroBanner />
        <FeatureHighlights />
        <ProductGrid />
        <LimitedEditionDrops />
        <FestivalCollections />
        <BridalPlanning />
        <RewardsProgram />
        <CommunitySection />
        <SmartFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
