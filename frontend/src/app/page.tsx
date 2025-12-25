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
} from "@/components/sections/home";

const Home = () => {
  return (
    <main>
      <Hero />
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
