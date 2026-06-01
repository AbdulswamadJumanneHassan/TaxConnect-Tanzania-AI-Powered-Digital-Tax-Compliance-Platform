import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { DigitalReceipt } from "@/components/DigitalReceipt";
import { Impact } from "@/components/Impact";
import { SupportSection } from "@/components/SupportSection";
import { AIAssistant } from "@/components/AIAssistant";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <DigitalReceipt />
      <Impact />
      <SupportSection />
      <AIAssistant />
      <Footer />
    </main>
  );
}
