import {
  ProductHero,
  ForecastingCapabilities,
  ConfidenceUncertainty,
  BacktestingPerformance,
  AlertsSignals,
} from "@/components/sections/product";

const Product = () => {
  return (
    <div>
      <ProductHero />
      <ForecastingCapabilities />
      <ConfidenceUncertainty />
      <BacktestingPerformance />
      <AlertsSignals />
    </div>
  );
};

export default Product;
