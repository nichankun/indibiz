import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { Hero } from "@/components/landing/hero";
import { TrustSection } from "@/components/landing/trust-section";
import { PackagesSection } from "@/components/landing/packages-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhatsAppContactSection } from "@/components/landing/whatsapp-contact-section";
import { Faq } from "@/components/landing/faq";
import { WhatsappFloat } from "@/components/landing/whatsapp-float";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteStructuredData } from "@/components/seo/site-structured-data";

const getPackages = unstable_cache(
  async () => {
    const [{ db }, { packages }, { asc, eq }] = await Promise.all([
      import("@/db"),
      import("@/db/database/schema"),
      import("drizzle-orm"),
    ]);
    const activePackages = await db.query.packages.findMany({
      where: eq(packages.isActive, true),
      orderBy: asc(packages.sortOrder),
    });

    const basicPackages = activePackages.filter((pkg) => pkg.category === "basic");
    const bisnisPackages = activePackages.filter((pkg) => pkg.category === "bisnis");

    return { basicPackages, bisnisPackages };
  },
  ["active-indibiz-packages"],
  { revalidate: 300 },
);

export default async function HomePage() {
  // The package query should run at request time, not while building the image.
  await connection();
  const { basicPackages, bisnisPackages } = await getPackages();

  return (
    <main>
      <SiteStructuredData />
      <Hero />
      <TrustSection />
      <PackagesSection basicPackages={basicPackages} bisnisPackages={bisnisPackages} />
      <HowItWorks />
      <Faq />
      <WhatsAppContactSection />
      <WhatsappFloat />
      <SiteFooter />
    </main>
  );
}
