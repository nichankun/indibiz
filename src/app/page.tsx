import { Suspense } from "react";
import { db } from "@/db";
import { packages } from "@/db/database/schema";
import { eq, and, asc } from "drizzle-orm";
import { Hero } from "@/components/landing/hero";
import { TrustSection } from "@/components/landing/trust-section";
import { PackagesSection } from "@/components/landing/packages-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CoverageChecker } from "@/components/landing/coverage-checker";
import { WhatsappFloat } from "@/components/landing/whatsapp-float";


export const revalidate = 300; // cache 5 menit — harga/promo jarang berubah tiap detik

async function getPackages() {
  const [basicPackages, bisnisPackages] = await Promise.all([
    db.query.packages.findMany({
      where: and(eq(packages.category, "basic"), eq(packages.isActive, true)),
      orderBy: asc(packages.sortOrder),
    }),
    db.query.packages.findMany({
      where: and(eq(packages.category, "bisnis"), eq(packages.isActive, true)),
      orderBy: asc(packages.sortOrder),
    }),
  ]);
  return { basicPackages, bisnisPackages };
}

export default async function HomePage() {
  const { basicPackages, bisnisPackages } = await getPackages();

  return (
    <main>
      <Hero />
      <TrustSection />
      <Suspense fallback={null}>
        <PackagesSection basicPackages={basicPackages} bisnisPackages={bisnisPackages} />
      </Suspense>
      <HowItWorks />
      <CoverageChecker />
      <WhatsappFloat />

    </main>
  );
}
