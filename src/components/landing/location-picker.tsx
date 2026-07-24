"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";

type LatLng = { lat: number; lng: number };

// Pusat default: Kendari, Sulawesi Tenggara — area layanan utama.
const DEFAULT_CENTER: LatLng = { lat: -3.9985, lng: 122.5129 };

type Props = {
  value: LatLng | null;
  onChange: (value: LatLng) => void;
};

/**
 * Tipe minimal untuk objek Google Maps yang benar-benar kita pakai.
 * Sengaja tidak bergantung pada paket @types/google.maps (namespace global
 * `google.maps`) supaya komponen ini tetap compile walau paket types
 * tersebut belum/gagal terpasang — cukup skrip Maps JS API dimuat di
 * runtime lewat tag <script>.
 */
type MapsLatLng = { lat: () => number; lng: () => number };
type MapsMouseEvent = { latLng: MapsLatLng | null };
type MapsMarker = {
  setPosition: (pos: LatLng | MapsLatLng) => void;
  getPosition: () => MapsLatLng | null;
  addListener: (event: string, handler: (...args: unknown[]) => void) => void;
};
type MapsMap = {
  panTo: (pos: LatLng) => void;
  addListener: (event: string, handler: (e: MapsMouseEvent) => void) => void;
};
type MapsNamespace = {
  maps: {
    Map: new (el: HTMLElement, opts: Record<string, unknown>) => MapsMap;
    Marker: new (opts: Record<string, unknown>) => MapsMarker;
  };
};

declare global {
  interface Window {
    google?: MapsNamespace;
    __onGoogleMapsLoaded?: () => void;
  }
}

let scriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window !== "undefined" && window.google?.maps) {
    return Promise.resolve();
  }
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&callback=__onGoogleMapsLoaded`;
    script.async = true;
    window.__onGoogleMapsLoaded = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Google Maps"));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function LocationPicker({ value, onChange }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapsMap | null>(null);
  const markerRef = useRef<MapsMarker | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error" | "missing-key">("idle");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setStatus("missing-key");
      return;
    }

    let cancelled = false;
    setStatus("loading");

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled || !mapContainerRef.current || !window.google) return;

        const center = value ?? DEFAULT_CENTER;
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center,
          zoom: 15,
          mapId: "INDIBIZ_REGISTRATION_MAP",
          disableDefaultUI: true,
          zoomControl: true,
        });
        mapRef.current = map;

        const marker = new window.google.maps.Marker({
          position: center,
          map,
          draggable: true,
        });
        markerRef.current = marker;

        marker.addListener("dragend", () => {
          const pos = marker.getPosition();
          if (pos) onChange({ lat: pos.lat(), lng: pos.lng() });
        });

        map.addListener("click", (e: MapsMouseEvent) => {
          if (!e.latLng) return;
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          marker.setPosition({ lat, lng });
          onChange({ lat, lng });
        });

        if (!value) onChange(center);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      onChange(coords);
      mapRef.current?.panTo(coords);
      markerRef.current?.setPosition(coords);
    });
  }

  /* PERBAIKAN: Sedikit merapikan font-size agar lebih konsisten */
  if (status === "missing-key") {
    return (
      <div className="rounded-lg border border-dashed border-border bg-secondary p-4 text-sm text-muted-foreground">
        Peta pin lokasi belum aktif — set <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> di
        file .env untuk mengaktifkan fitur ini. Alamat teks tetap tersimpan seperti biasa.
      </div>
    );
  }

  /* PERBAIKAN: Menggunakan warna "destructive" standar Shadcn alih-alih hardcode merah */
  if (status === "error") {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Gagal memuat peta. Periksa API key Google Maps Anda.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          {/* PERBAIKAN: Memberi warna aksen merah pada ikon */}
          <MapPin className="h-4 w-4 text-primary" /> Pin lokasi pemasangan
        </span>
        <Button type="button" size="sm" variant="outline" onClick={handleUseMyLocation}>
          {/* PERBAIKAN: Menambahkan margin kanan (mr-2) agar ada jarak antara ikon dan teks */}
          <LocateFixed className="mr-2 h-4 w-4" />
          Gunakan lokasi saya
        </Button>
      </div>
      
      {/* PERBAIKAN: Menambahkan bg-muted agar tidak melompong putih saat peta sedang di-load */}
      <div 
        ref={mapContainerRef} 
        className="h-56 w-full overflow-hidden rounded-xl border border-border bg-muted" 
      />
      
      {value && (
        <p className="text-xs text-muted-foreground">
          Koordinat: {value.lat.toFixed(6)}, {value.lng.toFixed(6)} — geser pin jika kurang tepat.
        </p>
      )}
    </div>
  );
}