import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import Testimonials4 from "../components/watermelon-ui/testimonials-4";
import { OpenSourceSection } from "../components/OpenSourceSection";
import { GitHubCTA } from "../components/GitHubCTA";
import { Footer } from "../components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4">
        <Header />
      </div>
      <main>
        <Hero />
        <HowItWorks />
        <Testimonials4 />
        <OpenSourceSection />
        <GitHubCTA />
      </main>
      <Footer />
    </div>
  );
}
