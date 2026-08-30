"""ingest_stations.py

Step 1 of the pipeline: clean the raw station name/code records
(sourced from real, published station-code data) into a single
deduplicated master CSV and JSON.

Usage:
    python ingest_stations.py

Input:
    ../app/data/stations_raw.txt   (one JSON object per line: {"name":..., "code":...})

Output:
    ../app/data/stations_master.csv
    ../app/data/stations_master.json
"""

import json
import csv
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent / "app" / "data"
RAW_PATH = BASE_DIR / "stations_raw.txt"
OUT_CSV_PATH = BASE_DIR / "stations_master.csv"
OUT_JSON_PATH = BASE_DIR / "stations_master.json"


def clean_code(code: str) -> str:
    """Uppercase, strip whitespace. Flag composite/legacy codes (e.g. 'LJN/LKO')."""
    return code.strip().upper()


def clean_name(name: str) -> str:
    """Normalize whitespace and casing; keep 'Jn.' style suffixes intact."""
    return re.sub(r"\s+", " ", name.strip())


def load_raw_records(path: Path):
    records = []
    with open(path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
                records.append(obj)
            except json.JSONDecodeError:
                print(f"  [skip] malformed line {line_num}: {line[:60]}")
    return records


def main():
    print(f"Reading raw records from {RAW_PATH} ...")
    raw = load_raw_records(RAW_PATH)
    print(f"  {len(raw)} raw records loaded")

    seen_codes = {}
    duplicates = []
    composite_codes = []

    for rec in raw:
        name = clean_name(rec.get("name", ""))
        code = clean_code(rec.get("code", ""))

        if not code or not name:
            continue

        # Flag composite codes like "LJN/LKO"
        if "/" in code:
            composite_codes.append((name, code))

        if code in seen_codes and seen_codes[code] != name:
            duplicates.append((code, seen_codes[code], name))
        else:
            seen_codes[code] = name

    print(f"  {len(seen_codes)} unique station codes")
    if duplicates:
        print(f"  [warn] {len(duplicates)} duplicate codes with differing names (kept first occurrence):")
        for code, old, new in duplicates[:10]:
            print(f"    {code}: '{old}' vs '{new}'")
    if composite_codes:
        print(f"  [warn] {len(composite_codes)} composite/legacy codes found (e.g. LJN/LKO) — review manually:")
        for name, code in composite_codes:
            print(f"    {name}: {code}")

    OUT_CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Write CSV
    with open(OUT_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["station_code", "station_name"])
        for code, name in sorted(seen_codes.items()):
            writer.writerow([code, name])

    print(f"\nDone. Master station table written to {OUT_CSV_PATH}")
    print(f"Rows: {len(seen_codes)}")


if __name__ == "__main__":
    main()
