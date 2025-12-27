import {
  ProductHero,
  ForecastingCapabilities,
  ConfidenceUncertainty,
  BacktestingPerformance,
} from "@/components/sections/product";

const Product = () => {
  return (
    <div>
      <ProductHero />
      <ForecastingCapabilities />
      <ConfidenceUncertainty />
      <BacktestingPerformance />
    </div>
  );
};

export default Product;
