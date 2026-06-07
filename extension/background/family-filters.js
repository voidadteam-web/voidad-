/** Apply dashboard family-filter rulesets (Layer 2 — bypasses Secure DNS in Edge/Chrome). */

const RULESET_SOCIAL = "family-social";
const RULESET_TIKTOK = "family-tiktok";

export async function applyFamilyFilterRules(filters) {
  if (!chrome.declarativeNetRequest?.updateEnabledRulesets) return;

  const enable = [];
  const disable = [];

  if (filters?.block_social_media) {
    enable.push(RULESET_SOCIAL);
  } else {
    disable.push(RULESET_SOCIAL);
  }

  if (filters?.block_tiktok) {
    enable.push(RULESET_TIKTOK);
  } else {
    disable.push(RULESET_TIKTOK);
  }

  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: enable,
      disableRulesetIds: disable,
    });
  } catch (error) {
    console.warn("[VoidAd] family rulesets update failed:", error);
  }
}

export async function fetchFamilyFiltersFromSite() {
  try {
    const res = await fetch("https://voidad.com/api/protection/settings", {
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.filters ?? null;
  } catch {
    return null;
  }
}
