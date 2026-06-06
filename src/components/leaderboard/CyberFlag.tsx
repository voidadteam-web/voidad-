import { cn } from "@/lib/utils";

/** Flag stripe colors — ISO alpha-2 */
const FLAG_PALETTES: Record<string, string[]> = {
  DE: ["#1a1a1a", "#c0392b", "#f1c40f"],
  AT: ["#c0392b", "#ffffff", "#c0392b"],
  CH: ["#c0392b", "#ffffff"],
  US: ["#3c3b6e", "#ffffff", "#b22234"],
  GB: ["#012169", "#ffffff", "#c8102e"],
  FR: ["#0055a4", "#ffffff", "#ef4135"],
  ES: ["#c60b1e", "#ffc400", "#c60b1e"],
  IT: ["#009246", "#ffffff", "#ce2b37"],
  NL: ["#ae1c28", "#ffffff", "#21468b"],
  BE: ["#000000", "#fdda24", "#ef3340"],
  PL: ["#ffffff", "#dc143c"],
  SE: ["#006aa7", "#fecc00"],
  NO: ["#ba0c2f", "#ffffff", "#00205b"],
  DK: ["#c8102e", "#ffffff"],
  FI: ["#ffffff", "#003580"],
  PT: ["#006600", "#ff0000"],
  IE: ["#169b62", "#ffffff", "#ff883e"],
  CA: ["#ff0000", "#ffffff", "#ff0000"],
  AU: ["#012169", "#ffffff", "#e4002b"],
  BR: ["#009c3b", "#ffdf00", "#002776"],
  MX: ["#006847", "#ffffff", "#ce1126"],
  IN: ["#ff9933", "#ffffff", "#138808"],
  JP: ["#ffffff", "#bc002d"],
  KR: ["#ffffff", "#003478", "#cd2e3a"],
  CN: ["#de2910", "#ffde00"],
  AE: ["#00732f", "#ffffff", "#000000"],
  SA: ["#006c35", "#ffffff"],
  EG: ["#ce1126", "#ffffff", "#000000"],
  TR: ["#e30a17", "#ffffff"],
  RU: ["#ffffff", "#0039a6", "#d52b1e"],
  UA: ["#005bbb", "#ffd500"],
  RO: ["#002b7f", "#fcd116", "#ce1126"],
  CZ: ["#ffffff", "#d7141a", "#11457e"],
  GR: ["#0d5eaf", "#ffffff"],
  HU: ["#cd2a3e", "#ffffff", "#436f4d"],
  IL: ["#ffffff", "#0038b8"],
  ZA: ["#007749", "#ffb612", "#de3831"],
  AR: ["#74acdf", "#ffffff", "#74acdf"],
  NZ: ["#012169", "#ffffff", "#c8102e"],
  SG: ["#ffffff", "#ef3340"],
};

type CyberFlagProps = {
  code: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE = { sm: { w: 28, h: 18 }, md: { w: 36, h: 22 }, lg: { w: 44, h: 28 } };

/** Digital mesh flag — neon cyber style matching VoidAd mockup */
export function CyberFlag({ code, size = "md", className }: CyberFlagProps) {
  const upper = code.toUpperCase();
  const colors = FLAG_PALETTES[upper] ?? ["#2a3a35", "#00ff99", "#1a2a25"];
  const { w, h } = SIZE[size];
  const stripeH = h / colors.length;

  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-[3px]",
        "border border-void-green/50 shadow-[0_0_10px_rgba(0,255,153,0.35)]",
        className,
      )}
      style={{ width: w, height: h }}
      aria-hidden
    >
      {colors.map((color, i) => (
        <span
          key={i}
          className="absolute left-0 w-full"
          style={{ top: i * stripeH, height: stripeH, backgroundColor: color, opacity: 0.85 }}
        />
      ))}
      {/* Mesh scanlines */}
      <span
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,153,0.15) 2px, rgba(0,255,153,0.15) 3px),
            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,255,153,0.08) 3px, rgba(0,255,153,0.08) 4px)
          `,
        }}
      />
      {/* Neon edge glow */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-void-green/25 via-transparent to-void-green/10" />
      <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-void-green/70" />
    </span>
  );
}
