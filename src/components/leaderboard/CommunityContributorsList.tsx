"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { CyberFlag } from "@/components/leaderboard/CyberFlag";
import { VoidRankShield } from "@/components/leaderboard/shields/VoidRankShield";
import {
  COMMUNITY_CONTRIBUTORS,
  groupContributorsByLevel,
  type CommunityContributor,
} from "@/components/leaderboard/community-contributors-data";
import { shieldTierForLevel } from "@/lib/shield-ranks";
import { cn } from "@/lib/utils";

type CommunityContributorsListProps = {
  className?: string;
};

/** Community Contributors — mockup layout, top 3 enlarged, all same-level users listed */
export function CommunityContributorsList({ className }: CommunityContributorsListProps) {
  const t = useTranslations("leaderboard");
  const groups = groupContributorsByLevel(COMMUNITY_CONTRIBUTORS);

  return (
    <div className={className}>
      <h2 className="void-display mb-5 text-sm tracking-[0.18em] text-void-green sm:text-base">
        {t("communityContributors")}
      </h2>

      <div className="space-y-5">
        {groups.map(({ level, members }) => (
          <div key={level}>
            {members.length > 1 && (
              <p className="void-display mb-2 text-[10px] tracking-[0.2em] text-void-green/80">
                {t("level")} {level} · {t("sharedLevel", { count: members.length })}
              </p>
            )}

            <ul className="space-y-2.5">
              {members.map((contributor) => (
                <ContributorRow
                  key={`${contributor.rank}-${contributor.username}`}
                  contributor={contributor}
                  levelLabel={t("level")}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContributorRow({
  contributor,
  levelLabel,
}: {
  contributor: CommunityContributor;
  levelLabel: string;
}) {
  const featured = contributor.rank <= 3;
  const flagSize = featured ? "lg" : "md";
  const shieldSize = featured ? 52 : 38;

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-void-black/55 transition",
        featured
          ? "void-glow-border-strong border-void-green/40 px-4 py-3.5 sm:px-5 sm:py-4"
          : "border-void-green/15 px-3 py-2.5",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-void-green/40",
          featured ? "h-14 w-14 sm:h-16 sm:w-16" : "h-10 w-10",
        )}
      >
        <Image
          src={contributor.avatarUrl}
          alt=""
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <CyberFlag code={contributor.countryCode} size={flagSize} />

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate font-medium text-void-text-mint",
            featured ? "text-base sm:text-lg" : "text-sm",
          )}
        >
          {contributor.displayName} ({contributor.countryCode}) — {contributor.username}
        </p>
        <p
          className={cn(
            "uppercase tracking-wider text-void-muted",
            featured ? "mt-1 text-[11px]" : "text-[10px]",
          )}
        >
          {levelLabel} {contributor.level}
        </p>

        {featured && (
          <div className="mt-2.5 space-y-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-void-black/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-void-green/50 to-void-green shadow-[0_0_6px_rgba(0,255,153,0.45)]"
                style={{ width: `${contributor.nextLevelProgress}%` }}
              />
            </div>
            <p className="text-[9px] uppercase tracking-wider text-void-muted">
              {contributor.nextLevelProgress}%
            </p>
          </div>
        )}
      </div>

      <VoidRankShield
        tier={shieldTierForLevel(contributor.level)}
        size={shieldSize}
        className={featured ? "drop-shadow-[0_0_14px_rgba(0,255,153,0.5)]" : undefined}
      />
    </li>
  );
}
