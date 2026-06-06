interface PricingStatsBarProps {
  adsBlocked: string;
  adsBlockedLabel: string;
  trackers: string;
  trackersLabel: string;
  dataSaved: string;
  dataSavedLabel: string;
}

export function PricingStatsBar({
  adsBlocked,
  adsBlockedLabel,
  trackers,
  trackersLabel,
  dataSaved,
  dataSavedLabel,
}: PricingStatsBarProps) {
  const items = [
    { value: adsBlocked, label: adsBlockedLabel },
    { value: trackers, label: trackersLabel },
    { value: dataSaved, label: dataSavedLabel },
  ];

  return (
    <div className="void-pricing-card grid divide-y divide-void-green/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {items.map(({ value, label }) => (
        <div key={label} className="px-6 py-8 text-center">
          <p className="void-display text-2xl font-bold tracking-wide text-white sm:text-3xl">
            {value}
          </p>
          <p className="void-section-title mt-2 text-[10px] text-void-muted">{label}</p>
        </div>
      ))}
    </div>
  );
}
