import {
  Forecastingenginehero,
  ForecastOutputs,
  SupportedHorizons,
} from "@/components/sections/product/engine";

const ForecastEngine = () => {
  return (
    <div>
      <Forecastingenginehero />
      <SupportedHorizons />
      <ForecastOutputs />
    </div>
  );
};

export default ForecastEngine;
