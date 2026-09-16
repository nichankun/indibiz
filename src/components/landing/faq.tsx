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
    <section id="faq" className="mx-auto max-w-3xl px-5 py-12 text-foreground sm:px-6 sm:py-24 lg:max-w-4xl lg:py-20">
      <div className="mb-7 text-center sm:mb-10 lg:mb-10">
        <h2 className="font-display text-[1.7rem] leading-[1.22] font-semibold tracking-[-0.025em] text-brand-navy sm:text-4xl">
          Pertanyaan umum tentang Indibiz
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-6 text-slate-600 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
          Belum ketemu jawabannya? Chat langsung tim sales kami via WhatsApp.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-2 lg:space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="rounded-xl border border-border/60 bg-muted/30 px-4 data-[state=open]:border-brand-blue/30 data-[state=open]:bg-brand-ice/50 lg:rounded-2xl lg:px-6"
          >
            <AccordionTrigger className="min-h-12 items-center gap-3 py-3 text-left text-[0.9375rem] leading-5 font-medium hover:no-underline sm:min-h-0 sm:items-start sm:py-2.5 sm:text-base lg:min-h-14 lg:py-4 lg:text-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-base lg:pb-5 lg:text-base lg:leading-7">
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
