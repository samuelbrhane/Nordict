import {
  DataSources,
  ForecastProcess,
  Limitations,
  MethodologyCTA,
  MethodologyHero,
  ModelOverview,
  Validation,
} from "@/components/sections/resources/methodology";

const Methodology = () => {
  return (
    <div>
      <MethodologyHero />
      <ModelOverview />
      <DataSources />
      <ForecastProcess />
      <Validation />
      <Limitations />
      <MethodologyCTA />
    </div>
  );
};

export default Methodology;
