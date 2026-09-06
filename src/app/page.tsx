import { db } from "@/db";
import { packages } from "@/db/database/schema";
import { eq, asc } from "drizzle-orm";
import { Hero } from "@/components/landing/hero";
import { TrustSection } from "@/components/landing/trust-section";
import { PackagesSection } from "@/components/landing/packages-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CoverageChecker } from "@/components/landing/coverage-checker";
import { Faq } from "@/components/landing/faq";
import { WhatsappFloat } from "@/components/landing/whatsapp-float";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteStructuredData } from "@/components/seo/site-structured-data";

export const revalidate = 300;

async function getPackages() {
  const activePackages = await db.query.packages.findMany({
    where: eq(packages.isActive, true),
    orderBy: asc(packages.sortOrder),
  });

  const basicPackages = activePackages.filter((pkg) => pkg.category === "basic");
  const bisnisPackages = activePackages.filter((pkg) => pkg.category === "bisnis");

  return { basicPackages, bisnisPackages };
}

export default async function HomePage() {
  const { basicPackages, bisnisPackages } = await getPackages();

  return (
    <main>
      <SiteStructuredData />
      <Hero />
      <TrustSection />
      <PackagesSection basicPackages={basicPackages} bisnisPackages={bisnisPackages} />
      <HowItWorks />
      <CoverageChecker />
      <Faq />
      <WhatsappFloat />
      <SiteFooter />
    </main>
  );
}
