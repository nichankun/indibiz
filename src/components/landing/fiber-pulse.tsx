type Props = {
  className?: string;
  variant?: "light" | "dark";
};

/**
 * Elemen signature Indibiz: garis fiber optic dengan titik cahaya yang
 * "mengalir" di sepanjang garis — merepresentasikan data yang terus
 * bergerak di jaringan. Dipakai berulang sebagai divider antar section
 * supaya jadi benang merah visual halaman, bukan cuma dekorasi sekali pakai.
 */
export function FiberPulse({ className = "", variant = "light" }: Props) {
  const lineColor = variant === "light" ? "#38bdf8" : "#1652f0";
  const trackColor = variant === "light" ? "#ffffff33" : "#0a1a3f1a";

  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <line x1="0" y1="12" x2="1200" y2="12" stroke={trackColor} strokeWidth="1" />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1="0"
          y1="12"
          x2="1200"
          y2="12"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="60 1140"
          className="animate-fiber-travel"
          style={{ animationDelay: `${i * 1.1}s` }}
        />
      ))}
    </svg>
  );
}