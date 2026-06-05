import { Navbar } from "@/components/Navbar";
import { HeroMinimal } from "@/components/HeroMinimal";
import { ProblemStatement } from "@/components/ProblemStatement";
import { AITaxIntelligence } from "@/components/AITaxIntelligence";
import { RegulatorCockpit } from "@/components/RegulatorCockpit";
import { HowItWorks } from "@/components/HowItWorks";
import { TRAAlignment } from "@/components/TRAAlignment";
import { TanzaniaInnovation } from "@/components/TanzaniaInnovation";
import { DashboardPreview } from "@/components/DashboardPreview";
import { ImpactBenefits } from "@/components/ImpactBenefits";
import { SecurityData } from "@/components/SecurityData";
import { CTAMinimal } from "@/components/CTAMinimal";
import { AIAssistant } from "@/components/AIAssistant";
import { Footer } from "@/components/Footer";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="min-h-screen w-full bg-slate-950">
      <Navbar user={session} />
      <HeroMinimal />
      <ProblemStatement />
      <AITaxIntelligence />
      <RegulatorCockpit />
      <HowItWorks />
      <TRAAlignment />
      <TanzaniaInnovation />
      <DashboardPreview />
      <ImpactBenefits />
      <SecurityData />
      <CTAMinimal />
      <AIAssistant />
      <Footer />
    </main>
  );
}
