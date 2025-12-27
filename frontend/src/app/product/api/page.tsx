import {
  APIHero,
  Authentication,
  EndpointsOverview,
  SDKs,
  Webhooks,
} from "@/components/sections/product/api";

const Api = () => {
  return (
    <div>
      <APIHero />
      <EndpointsOverview />
      <Authentication />
      <Webhooks />
      <SDKs />
    </div>
  );
};

export default Api;
