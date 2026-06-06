#!/usr/bin/env python3
"""CLI wrapper — downloads blocklist via voidad_dns.blocklist_fetcher."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from voidad_dns.blocklist_fetcher import (
    BlocklistSource,
    fetch_and_save,
    is_stale,
    read_meta,
)


def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch VoidAd DNS blocklist")
    parser.add_argument(
        "--source",
        choices=[s.value for s in BlocklistSource],
        default="oisd-big",
        help="Blocklist source (default: oisd-big ≈ 450k domains)",
    )
    parser.add_argument(
        "--if-stale",
        type=float,
        metavar="HOURS",
        help="Skip download if blocklist is newer than HOURS",
    )
    parser.add_argument("--force", action="store_true", help="Always re-download")
    args = parser.parse_args()

    if args.if_stale is not None and not args.force and not is_stale(args.if_stale):
        meta = read_meta() or {}
        print(f"Blocklist fresh ({meta.get('count', 0):,} domains). Skipping download.")
        return 0

    try:
        count, url = fetch_and_save(BlocklistSource(args.source), force=args.force)
    except Exception as exc:
        print(f"Download failed: {exc}", file=sys.stderr)
        return 1

    print(f"Saved {count:,} domains from {url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
