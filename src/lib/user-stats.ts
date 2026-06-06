import { carbonTreeLevelForPlayerLevel } from "@/lib/carbon-trees";
import { MAX_PLAYER_LEVEL } from "@/lib/levels";

export type UserStatsInput = {
  level: number;
  voidpointsTotal: number;
  voidpointsDonated: number;
  adsBlocked: number;
};

export type UserStats = {
  level: number;
  voidpoints: number;
  voidpointsDonated: number;
  adsBlocked: number;
  trackersBlocked: number;
  bandwidthGb: number;
  carbonOffsetKg: number;
  carbonTreeLevel: number;
  /** €1 = 1,000 VoidPoints */
  estimatedSavingsEur: number;
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
  const { bandwidthGb, carbonOffsetKg, trackersBlocked } = deriveImpactMetrics(
    input.adsBlocked,
    input.voidpointsDonated,
  );

  return {
    level: input.level,
    voidpoints: input.voidpointsTotal,
    voidpointsDonated: input.voidpointsDonated,
    adsBlocked: input.adsBlocked,
    trackersBlocked,
    bandwidthGb,
    carbonOffsetKg,
    carbonTreeLevel: carbonTreeLevelForPlayerLevel(input.level),
    estimatedSavingsEur: input.voidpointsTotal / 1000,
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
    maximumFractionDigits: 2,
  }).format(amount);
}
