import { carbonTreeLevelForPlayerLevel } from "@/lib/carbon-trees";
import { MAX_PLAYER_LEVEL, voidpointsToCents, voidpointsToEuro } from "@/lib/levels";

export type UserStatsInput = {
  level: number;
  voidpointsTotal: number;
  voidpointsDonated: number;
  adsBlocked: number;
  trackersBlocked?: number;
  maliciousBlocked?: number;
};

export type UserStats = {
  level: number;
  voidpoints: number;
  voidpointsDonated: number;
  adsBlocked: number;
  trackersBlocked: number;
  maliciousBlocked: number;
  bandwidthGb: number;
  carbonOffsetKg: number;
  carbonTreeLevel: number;
  /** 1,000 VoidPoints = €0.001 (0.10 cent) */
  estimatedSavingsEur: number;
  estimatedSavingsCents: number;
};

/** Shared impact formulas — ads blocked + donations → bandwidth & carbon */
export function deriveImpactMetrics(adsBlocked: number, voidpointsDonated: number) {
  const bandwidthGb = Math.round(adsBlocked / 850);
  const carbonOffsetKg = Math.round(bandwidthGb * 0.28 + voidpointsDonated / 1200);
  const trackersBlocked = Math.round(adsBlocked * 0.62);
  return { bandwidthGb, carbonOffsetKg, trackersBlocked };
}

export function clampPlayerLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.min(MAX_PLAYER_LEVEL, Math.max(1, level));
}

export function buildUserStats(input: UserStatsInput): UserStats {
  const derived = deriveImpactMetrics(input.adsBlocked, input.voidpointsDonated);
  const trackersBlocked = input.trackersBlocked ?? derived.trackersBlocked;
  const maliciousBlocked = input.maliciousBlocked ?? 0;

  return {
    level: input.level,
    voidpoints: input.voidpointsTotal,
    voidpointsDonated: input.voidpointsDonated,
    adsBlocked: input.adsBlocked,
    trackersBlocked,
    maliciousBlocked,
    bandwidthGb: derived.bandwidthGb,
    carbonOffsetKg: derived.carbonOffsetKg,
    carbonTreeLevel: carbonTreeLevelForPlayerLevel(input.level),
    estimatedSavingsEur: voidpointsToEuro(input.voidpointsTotal),
    estimatedSavingsCents: voidpointsToCents(input.voidpointsTotal),
  };
}

export function formatBandwidthGb(gb: number, locale = "en"): string {
  return `${gb.toLocaleString(locale)} GB`;
}

export function formatCarbonKg(kg: number, locale = "en"): string {
  return `${kg.toLocaleString(locale)} KG CO₂`;
}

export function formatEuro(amount: number, locale = "en"): string {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatCents(cents: number, locale = "en"): string {
  return `${cents.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ¢`;
}

/** Display estimated savings — rounds to €0.00 below 1 cent total */
export function formatEstimatedSavings(voidpoints: number, locale = "en"): string {
  const cents = voidpointsToCents(voidpoints);
  if (cents < 1) return formatEuro(0, locale);
  if (cents < 100) return formatCents(cents, locale);
  return formatEuro(voidpointsToEuro(voidpoints), locale);
}
