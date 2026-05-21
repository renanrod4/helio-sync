#!/usr/bin/env python3
"""Generate mockTelemetry entries with 20-minute ticks per panel.

Usage:
  python scripts/generate_mock_telemetry.py --days 7 --start-date 2026-05-15 \
    --update-last-sync

If --start-date is omitted, uses today (UTC) minus (days-1).
"""

from __future__ import annotations

import argparse
import datetime as dt
import math
import random
import re
from pathlib import Path
from typing import Iterable, List

ROOT = Path(__file__).resolve().parents[1]
MOCK_FILE = ROOT / "lib" / "mockData.ts"

PANEL_ID_RE = re.compile(r"id:\s*'(?P<id>pnl_\d+)'", re.MULTILINE)

TELEMETRY_BLOCK_RE = re.compile(
    r"export const mockTelemetry: MockTelemetry\[] = \[(?P<body>[\s\S]*?)\];",
    re.MULTILINE,
)

LAST_SYNC_RE = re.compile(r"(lastSyncAt:\s*')([^']*)(')")


def parse_panel_ids(content: str) -> List[str]:
    return list(dict.fromkeys(match.group("id") for match in PANEL_ID_RE.finditer(content)))


def daterange(start: dt.date, days: int) -> Iterable[dt.date]:
    for offset in range(days):
        yield start + dt.timedelta(days=offset)


def solar_profile(hour: float) -> float:
    """Return a 0..1 profile between 6h and 18h using a sine curve."""
    if hour < 6 or hour > 18:
        return 0.0
    t = (hour - 6.0) / 12.0  # 0..1
    return math.sin(math.pi * t)


def build_series(
    panel_id: str,
    start_date: dt.date,
    days: int,
    seed: int,
    max_voltage: float,
    max_power: float,
) -> List[dict]:
    rng = random.Random(seed)
    entries = []
    tick_minutes = 20
    ticks_per_day = int(24 * 60 / tick_minutes)

    for day in daterange(start_date, days):
        for tick in range(ticks_per_day):
            minutes = tick * tick_minutes
            hour = minutes / 60.0
            if hour < 5 or hour > 20:
                continue
            profile = solar_profile(hour)
            noise = rng.uniform(-0.05, 0.05)
            voltage = max_voltage * max(profile + noise, 0.0)
            power = max_power * max(profile + noise * 0.8, 0.0)
            angle = 5 + 35 * profile

            timestamp = dt.datetime(
                day.year, day.month, day.day, minutes // 60, minutes % 60, tzinfo=dt.timezone.utc
            )

            entries.append(
                {
                    "panelId": panel_id,
                    "timestamp": timestamp.isoformat().replace("+00:00", "Z"),
                    "voltageV": round(voltage, 1),
                    "powerW": int(round(power)),
                    "angleDeg": round(angle, 1),
                }
            )

    return entries


def build_mock_telemetry(panel_ids: List[str], start_date: dt.date, days: int) -> List[dict]:
    entries: List[dict] = []
    for index, panel_id in enumerate(panel_ids):
        max_voltage = 22.0 - (index * 0.8)
        max_power = 420.0 - (index * 40.0)
        seed = 1000 + index * 97
        entries.extend(build_series(panel_id, start_date, days, seed, max_voltage, max_power))

    entries.sort(key=lambda item: item["timestamp"])
    for idx, entry in enumerate(entries, start=1):
        entry["id"] = f"tel_{idx:04d}"
    return entries


def format_entry(entry: dict) -> str:
    return (
        "\t{\n"
        f"\t\tid: '{entry['id']}',\n"
        f"\t\tpanelId: '{entry['panelId']}',\n"
        f"\t\ttimestamp: '{entry['timestamp']}',\n"
        f"\t\tvoltageV: {entry['voltageV']},\n"
        f"\t\tpowerW: {entry['powerW']},\n"
        f"\t\tangleDeg: {entry['angleDeg']},\n"
        "\t}"
    )


def replace_mock_telemetry(content: str, entries: List[dict]) -> str:
    body = ",\n".join(format_entry(entry) for entry in entries)
    replacement = f"export const mockTelemetry: MockTelemetry[] = [\n{body}\n];"
    return TELEMETRY_BLOCK_RE.sub(replacement, content)


def update_last_sync(content: str, latest_timestamp: str) -> str:
    def _replace(match: re.Match) -> str:
        return f"{match.group(1)}{latest_timestamp}{match.group(3)}"

    return LAST_SYNC_RE.sub(_replace, content)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate mock telemetry for all panels.")
    parser.add_argument("--days", type=int, default=7, help="Number of days to generate (default: 7)")
    parser.add_argument("--start-date", type=str, default="", help="Start date YYYY-MM-DD (UTC)")
    parser.add_argument(
        "--update-last-sync",
        action="store_true",
        help="Update lastSyncAt for all panels to the latest generated timestamp",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    content = MOCK_FILE.read_text(encoding="utf-8")
    panel_ids = parse_panel_ids(content)
    if not panel_ids:
        raise SystemExit("No panel IDs found in mockData.ts")

    if args.start_date:
        start_date = dt.date.fromisoformat(args.start_date)
    else:
        today = dt.datetime.now(dt.timezone.utc).date()
        start_date = today - dt.timedelta(days=args.days - 1)

    entries = build_mock_telemetry(panel_ids, start_date, args.days)
    updated = replace_mock_telemetry(content, entries)

    if args.update_last_sync and entries:
        latest_timestamp = entries[-1]["timestamp"]
        updated = update_last_sync(updated, latest_timestamp)

    MOCK_FILE.write_text(updated, encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
