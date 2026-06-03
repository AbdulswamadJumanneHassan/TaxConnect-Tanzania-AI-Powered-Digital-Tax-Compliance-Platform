import { Navbar } from "@/components/Navbar";
import { HeroMinimal } from "@/components/HeroMinimal";
import { FeaturesMinimal } from "@/components/FeaturesMinimal";
import { ShowcaseMinimal } from "@/components/ShowcaseMinimal";
import { PricingMinimal } from "@/components/PricingMinimal";
import { CTAMinimal } from "@/components/CTAMinimal";
import { AIAssistant } from "@/components/AIAssistant";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-slate-950">
      <Navbar />
      <HeroMinimal />
      <FeaturesMinimal />
      <ShowcaseMinimal />
      <PricingMinimal />
      <CTAMinimal />
      <AIAssistant />
      <Footer />
    </main>
  );
}
