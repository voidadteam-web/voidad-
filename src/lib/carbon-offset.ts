/** KB of transfer avoided per blocked request (IAB / digital sustainability averages) */
export const KB_PER_AD_BLOCK = 200;
export const KB_PER_TRACKER_BLOCK = 85;
export const KB_PER_PHISHING_BLOCK = 120;

/** kg CO₂ per GB of data not transferred (network energy mix average) */
export const KG_CO2_PER_GB_SAVED = 0.278;

/** kg CO₂ funded per VoidPoint donated to offset charities */
export const KG_CO2_PER_VOIDPOINT_DONATED = 1 / 1200;

export type CarbonBlockInput = {
  adsBlocked: number;
  trackersBlocked?: number;
  maliciousBlocked?: number;
  voidpointsTotal?: number;
  voidpointsDonated?: number;
};

function effectiveBlockCounts(input: CarbonBlockInput) {
  const proxyBlocks = Math.max(0, input.voidpointsTotal ?? 0);
  const ads = Math.max(input.adsBlocked, proxyBlocks);
  const trackers =
    input.trackersBlocked !== undefined
      ? Math.max(0, input.trackersBlocked)
      : Math.round(ads * 0.62);
  const phishing = Math.max(0, input.maliciousBlocked ?? 0);
  const donated = Math.max(0, input.voidpointsDonated ?? 0);

  return { ads, trackers, phishing, donated };
}

/** Data not transferred (GB) from blocked ads, trackers, and phishing */
export function bandwidthGbFromBlocks(input: CarbonBlockInput): number {
  const { ads, trackers, phishing } = effectiveBlockCounts(input);
  const totalKb =
    ads * KB_PER_AD_BLOCK +
    trackers * KB_PER_TRACKER_BLOCK +
    phishing * KB_PER_PHISHING_BLOCK;

  return totalKb / (1024 * 1024);
}

/** Real carbon offset (kg CO₂) from bandwidth saved + charity donations */
export function carbonOffsetKgFromActivity(input: CarbonBlockInput): number {
  const { donated } = effectiveBlockCounts(input);
  const gbSaved = bandwidthGbFromBlocks(input);
  const fromBlocking = gbSaved * KG_CO2_PER_GB_SAVED;
  const fromDonations = donated * KG_CO2_PER_VOIDPOINT_DONATED;

  return fromBlocking + fromDonations;
}
