export const CARBON_TREE_LEVEL_COUNT = 10;

export const CARBON_TREE_NAMES: Record<number, string> = {
  1: "Void Seed",
  2: "Protosprout",
  3: "Quantum Sapling",
  4: "Data Sapling",
  5: "Network Tree",
  6: "Void Tree",
  7: "Reclaimer Tree",
  8: "Global Data Network Tree",
  9: "Elite Void Tree",
  10: "Grand Guardian Network Tree",
};

export function carbonTreeImageForLevel(level: number): string {
  const clamped = Math.min(CARBON_TREE_LEVEL_COUNT, Math.max(1, Math.round(level)));
  return `/trees/tree-level-${clamped}.png`;
}

export function carbonTreeNameForLevel(level: number): string {
  const clamped = Math.min(CARBON_TREE_LEVEL_COUNT, Math.max(1, Math.round(level)));
  return CARBON_TREE_NAMES[clamped] ?? CARBON_TREE_NAMES[1]!;
}

export function clampCarbonTreeLevel(level: number): number {
  return Math.min(CARBON_TREE_LEVEL_COUNT, Math.max(1, Math.round(level)));
}
