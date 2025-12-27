import {
  APIHero,
  Authentication,
  EndpointsOverview,
  Webhooks,
} from "@/components/sections/product/api";

const Api = () => {
  return (
    <div>
      <APIHero />
      <EndpointsOverview />
      <Authentication />
      <Webhooks />
    </div>
  );
};

export default Api;
