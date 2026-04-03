import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import LatestProperties from "@/components/home/LatestProperties";

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      <HeroSection />
      <StatsSection />
      <LatestProperties />
      {/* Other sections like Testimonials, Features can go here */}
    </div>
  );
}

