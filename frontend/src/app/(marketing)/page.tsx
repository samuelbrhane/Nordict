import {
  Hero,
  TrustStrip,
  ProblemSolution,
  CoreFeatures,
  ProductPreview,
  HowItWorks,
  MethodologyHighlights,
  UseCases,
  FAQ,
  FinalCTA,
  MarketLogos,
} from "@/components/sections/home";

const Home = () => {
  return (
    <main>
      <Hero />
      <MarketLogos />
      <TrustStrip />
      <ProblemSolution />
      <CoreFeatures />
      <ProductPreview />
      <HowItWorks />
      <MethodologyHighlights />
      <UseCases />
      <FAQ />
      <FinalCTA />
    </main>
  );
};

export default Home;
