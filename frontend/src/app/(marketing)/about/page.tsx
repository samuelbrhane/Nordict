import {
  AboutCTA,
  AboutHero,
  AboutStory,
  AboutValues,
} from "@/components/sections/company/about";

export default function About() {
  return (
    <div>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutCTA />
    </div>
  );
}
