import {
  Header,
  Hero,
  Features,
  HowItWorks,
  ForHosts,
  CTA,
  Footer,
} from "@/components/marketing";

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
