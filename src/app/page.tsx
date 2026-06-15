"use client";

import { Hero } from "@/components/Hero";
import { LeakSimulator } from "@/components/LeakSimulator";
import { SuspectCards } from "@/components/SuspectCards";
import { ViewerDemo } from "@/components/ViewerDemo";
import { WhyNoSusExists } from "@/components/WhyNoSusExists";
import AppPreview from "@/components/AppPreview";
import { AboutCreator } from "@/components/AboutCreator";
import { Section } from "@/components/Section";
import { WaitlistForm } from "@/components/WaitlistForm";
import { HowItWorks } from "@/components/HowItWorks";
import { FinalSection } from "@/components/FinalSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <LeakSimulator />
      <SuspectCards />
      <HowItWorks />
      <ViewerDemo />
      <WhyNoSusExists />
      <AppPreview />
      <AboutCreator />
      <Section id="waitlist" className="py-24">
        <div className="text-center mb-12">
          <h2 className="text-xs md:text-sm font-mono tracking-[0.3em] uppercase text-zinc-500 mb-3">
            THE FIRST ENCLAVE
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            25 TESTERS ONLY
          </p>
        </div>
        <WaitlistForm />
      </Section>
      <FinalSection />
    </main>
  );
}
