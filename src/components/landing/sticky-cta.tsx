"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-[var(--border)] bg-white/95 px-6 py-3 backdrop-blur transition-transform sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="text-sm">
        <div className="font-semibold">Mulai dari Rp320rb/bulan</div>
        <div className="text-[var(--muted-foreground)]">Gratis instalasi</div>
      </div>
      <Button variant="accent" asChild>
        <a href="#paket">Daftar</a>
      </Button>
    </div>
  );
}
