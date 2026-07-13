#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
items = []

patterns = [
    "notebooks/*/app.json",
    "apps/*/*/app.json",
]

for pattern in patterns:
    for app_json in sorted(ROOT.glob(pattern)):
        try:
            data = json.loads(app_json.read_text(encoding="utf-8"))
        except Exception as exc:
            print(f"Skipping invalid JSON {app_json}: {exc}")
            continue

        rel_dir = app_json.parent.relative_to(ROOT).as_posix()
        items.append({
            "title": data.get("title", app_json.parent.name),
            "path": rel_dir,
            "type": data.get("type", "app"),
            "category": data.get("category", ""),
            "status": str(data.get("status", "draft")).lower(),
        })

items.sort(key=lambda item: (item["status"], item["title"].lower()))
out = ROOT / "publication-status.json"
out.write_text(json.dumps(items, indent=2) + "\n", encoding="utf-8")
print(f"Wrote {out} with {len(items)} entries")
