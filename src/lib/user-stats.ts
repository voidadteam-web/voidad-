import { carbonTreeLevelForPlayerLevel } from "@/lib/carbon-trees";
import {
  bandwidthGbFromBlocks,
  carbonOffsetKgFromActivity,
} from "@/lib/carbon-offset";
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

/** Shared impact formulas — blocks + donations → bandwidth & carbon */
export function deriveImpactMetrics(
  adsBlocked: number,
  voidpointsDonated: number,
  options?: {
    trackersBlocked?: number;
    maliciousBlocked?: number;
    voidpointsTotal?: number;
  },
) {
  const input = {
    adsBlocked,
    voidpointsDonated,
    trackersBlocked: options?.trackersBlocked,
    maliciousBlocked: options?.maliciousBlocked,
    voidpointsTotal: options?.voidpointsTotal,
  };
  const bandwidthGb = bandwidthGbFromBlocks(input);
  const carbonOffsetKg = carbonOffsetKgFromActivity(input);
  const trackersBlocked =
    options?.trackersBlocked ?? Math.round(Math.max(adsBlocked, options?.voidpointsTotal ?? 0) * 0.62);

  return { bandwidthGb, carbonOffsetKg, trackersBlocked };
}

export function clampPlayerLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.min(MAX_PLAYER_LEVEL, Math.max(1, level));
}

export function buildUserStats(input: UserStatsInput): UserStats {
  const derived = deriveImpactMetrics(input.adsBlocked, input.voidpointsDonated, {
    trackersBlocked: input.trackersBlocked,
    maliciousBlocked: input.maliciousBlocked,
    voidpointsTotal: input.voidpointsTotal,
  });
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
  if (gb > 0 && gb < 0.01) {
    const mb = gb * 1024;
    return `${mb.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MB`;
  }
  if (gb < 1) {
    return `${gb.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GB`;
  }
  return `${gb.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} GB`;
}

export function formatCarbonKg(kg: number, locale = "en"): string {
  if (kg <= 0) {
    return `0 KG CO₂`;
  }
  if (kg < 0.01) {
    const grams = kg * 1000;
    return `${grams.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} g CO₂`;
  }
  if (kg < 1) {
    return `${kg.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KG CO₂`;
  }
  return `${kg.toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} KG CO₂`;
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
