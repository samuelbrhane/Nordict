import { FinalCTA } from "@/components/sections/home";
import {
  ProductHero,
  ForecastingCapabilities,
  ConfidenceUncertainty,
  BacktestingPerformance,
  AlertsSignals,
  APIIntegrations,
  ProductArchitecture,
  WhyDifferent,
  ProductCTA,
} from "@/components/sections/product/overview";

const Product = () => {
  return (
    <div>
      <ProductHero />
      <ForecastingCapabilities />
      <ConfidenceUncertainty />
      <BacktestingPerformance />
      <AlertsSignals />
      {/* <APIIntegrations /> */}
      <div className="hidden lg:block">
        <ProductArchitecture />
      </div>
      <WhyDifferent />
      <FinalCTA />
    </div>
  );
};

export default Product;
