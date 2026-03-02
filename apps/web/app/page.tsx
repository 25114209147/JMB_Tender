"use client"

import { CategoriesSection } from "@/components/landing-page/categories-section"
import { CtaSection } from "@/components/landing-page/CTA-section"
import LandingPageHeroSection from "@/components/landing-page/hero-section"
import HowItWorks from "@/components/landing-page/how-it-works"
import { LandingHeader } from "@/components/landing-page/landing-page-header"
import { TrustSection } from "@/components/landing-page/trust-section"

export default function Home() {
  return (
    <>
      <LandingHeader/>
      <LandingPageHeroSection />
      <HowItWorks />
      <CategoriesSection />
      <TrustSection />
      <CtaSection />
    </>
  )
}
