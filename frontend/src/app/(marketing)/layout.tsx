import { MarketingLayout } from "@/components/market";

export default function MarketGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}
