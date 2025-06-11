'use client';

import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  DemoSection,
  FAQSection,
  CTASection,
  FloatingNavigation,
} from "@/components/landing";

export default function HomePage() {
  const handleStartCreating = () => {
    window.location.href = "/create";
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="hero">
        <HeroSection onStartCreating={handleStartCreating} />
      </section>

      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorksSection />
      </section>

      {/* Demo Section */}
      <section id="demo">
        <DemoSection />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* Final CTA Section */}
      <section id="get-started">
        <CTASection
          title="Ready to start building?"
          subtitle="Join thousands of developers who trust Mocklyst for rapid prototyping and testing."
          primaryCTA={{
            text: "Create Mock API",
            href: "/create",
          }}
          secondaryCTA={{
            text: "View Documentation",
            href: "/docs",
          }}
          variant="primary"
        />
      </section>

      {/* Floating Navigation */}
      <FloatingNavigation />
    </div>
  );
}
