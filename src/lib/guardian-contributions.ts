import { carbonTreeLevelForPlayerLevel } from "@/lib/carbon-trees";
import { deriveImpactMetrics } from "@/lib/user-stats";

export type GuardianContributions = {
  adsBlocked: number;
  donated: number;
  trackersBlocked: number;
  bandwidthGb: number;
  carbonOffsetKg: number;
  voidpointsEarned: number;
  carbonTreeLevel: number;
  protectionDays: number;
};

export type ContributionMetric = {
  key: keyof GuardianContributions;
  label: string;
  value: number;
  display: string;
  weight: number;
  progress: number;
};

function formatNum(value: number, suffix = ""): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${suffix}`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K${suffix}`;
  return `${Math.round(value)}${suffix}`;
}

/** Derive contribution stats from leaderboard rank / level */
export function buildGuardianContributions(rank: number, level: number): GuardianContributions {
  const adsBlocked = Math.max(50_000, 1_550_000 - rank * 25_000);
  const donated = Math.max(5_000, 305_000 - rank * 5_000);
  const { trackersBlocked, bandwidthGb, carbonOffsetKg } = deriveImpactMetrics(
    adsBlocked,
    donated,
  );
  const voidpointsEarned = Math.round(adsBlocked * 0.04 + donated * 1.2);
  const carbonTreeLevel = carbonTreeLevelForPlayerLevel(level);
  const protectionDays = Math.max(30, 400 - rank * 6);

  return {
    adsBlocked,
    donated,
    trackersBlocked,
    bandwidthGb,
    carbonOffsetKg,
    voidpointsEarned,
    carbonTreeLevel,
    protectionDays,
  };
}

export function contributionMetrics(
  c: GuardianContributions,
  labels: Record<string, string>,
): ContributionMetric[] {
  const total =
    c.adsBlocked * 0.35 +
    c.donated * 0.25 +
    c.trackersBlocked * 0.15 +
    c.bandwidthGb * 120 +
    c.carbonOffsetKg * 800 +
    c.voidpointsEarned * 0.08;

  const items: {
    key: keyof GuardianContributions;
    labelKey: string;
    value: number;
    display: string;
    weight: number;
  }[] = [
    { key: "adsBlocked", labelKey: "adsBlockedLabel", value: c.adsBlocked, display: formatNum(c.adsBlocked), weight: 35 },
    { key: "donated", labelKey: "donatedPoints", value: c.donated, display: formatNum(c.donated), weight: 25 },
    { key: "trackersBlocked", labelKey: "trackersBlocked", value: c.trackersBlocked, display: formatNum(c.trackersBlocked), weight: 15 },
    { key: "bandwidthGb", labelKey: "bandwidthSaved", value: c.bandwidthGb, display: `${formatNum(c.bandwidthGb)} GB`, weight: 12 },
    { key: "carbonOffsetKg", labelKey: "carbonOffset", value: c.carbonOffsetKg, display: `${formatNum(c.carbonOffsetKg)} KG CO₂`, weight: 8 },
    { key: "voidpointsEarned", labelKey: "voidpointsEarned", value: c.voidpointsEarned, display: formatNum(c.voidpointsEarned), weight: 5 },
  ];

  return items.map((item) => {
    const share =
      item.key === "adsBlocked"
        ? (item.value * 0.35) / total
        : item.key === "donated"
          ? (item.value * 0.25) / total
          : item.key === "trackersBlocked"
            ? (item.value * 0.15) / total
            : item.key === "bandwidthGb"
              ? (item.value * 120) / total
              : item.key === "carbonOffsetKg"
                ? (item.value * 800) / total
                : (item.value * 0.08) / total;
    return {
      key: item.key,
      label: labels[item.labelKey] ?? item.labelKey,
      value: item.value,
      display: item.display,
      weight: item.weight,
      progress: Math.min(98, Math.round(share * 100)),
    };
  });
}
