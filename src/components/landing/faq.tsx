"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS, getCityFaqs } from "@/lib/faqs";

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-16 sm:py-24 text-foreground">
      <div className="mb-10 text-center">
       
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          FAQ WiFi Indibiz
        </h2>
        <p className="mt-3 text-muted-foreground">
          Belum ketemu jawabannya? Chat langsung tim sales kami via WhatsApp.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="rounded-xl border border-border/60 bg-muted/30 px-4 data-[state=open]:border-brand-blue/30 data-[state=open]:bg-brand-ice/50"
          >
            <AccordionTrigger className="text-left text-sm font-medium hover:no-underline sm:text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-base">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function CityFaq({ cityName, areas }: { cityName: string; areas: string }) {
  const cityFaqs = getCityFaqs(cityName, areas);

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="font-display text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
          Pertanyaan Seputar Pasang Indibiz {cityName}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Informasi penting mengenai jangkauan, proses pasang, dan paket di area {cityName}.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {cityFaqs.map((item, i) => (
          <AccordionItem
            key={i}
            value={`city-item-${i}`}
            className="rounded-xl border border-border/60 bg-card px-4"
          >
            <AccordionTrigger className="text-left text-sm font-medium hover:no-underline sm:text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-base">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
