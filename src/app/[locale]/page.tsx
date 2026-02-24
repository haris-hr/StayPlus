import dynamic from "next/dynamic";
import { Header, Hero } from "@/components/marketing";

// Lazy load below-the-fold components
const Features = dynamic(() => import("@/components/marketing/Features").then(mod => ({ default: mod.Features })), {
  loading: () => <div className="min-h-[400px]" />,
});

const HowItWorks = dynamic(() => import("@/components/marketing/HowItWorks").then(mod => ({ default: mod.HowItWorks })), {
  loading: () => <div className="min-h-[400px]" />,
});

const ForHosts = dynamic(() => import("@/components/marketing/ForHosts").then(mod => ({ default: mod.ForHosts })), {
  loading: () => <div className="min-h-[400px]" />,
});

const CTA = dynamic(() => import("@/components/marketing/CTA").then(mod => ({ default: mod.CTA })), {
  loading: () => <div className="min-h-[200px]" />,
});

const Footer = dynamic(() => import("@/components/marketing/Footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="min-h-[200px]" />,
});

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <ForHosts />
      <CTA />
      <Footer />
    </main>
  );
}
