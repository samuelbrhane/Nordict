import {
  ConfidenceBands,
  Forecastingenginehero,
  ForecastOutputs,
  ModelLifecycle,
  SupportedHorizons,
} from "@/components/sections/product/engine";

const ForecastEngine = () => {
  return (
    <div>
      <Forecastingenginehero />
      <SupportedHorizons />
      <ForecastOutputs />
      <ConfidenceBands />
      <ModelLifecycle />
    </div>
  );
};

export default ForecastEngine;
