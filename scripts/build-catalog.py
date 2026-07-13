#!/usr/bin/env python3
import json
from pathlib import Path

ROOTS = [Path("apps"), Path("notebooks")]
items = []


def is_gpu_item(item):
    if item.get("gpu") is True:
        return True

    fields = [item.get("title", ""), item.get("description", "")]
    tags = item.get("tags", [])
    fields.extend(tags if isinstance(tags, list) else [])
    blob = " ".join(str(field) for field in fields).lower()
    return any(keyword in blob for keyword in ("webgpu", "webgl2", "webgl", "gpu"))

for root in ROOTS:
    if not root.exists():
        continue

    for meta_path in sorted(root.rglob("app.json")):
        folder = meta_path.parent
        with meta_path.open("r", encoding="utf-8") as f:
            item = json.load(f)

        entry = item.get("entry", "index.html")
        url = str(folder / entry).replace("\\", "/")

        if entry == "index.html":
            url = str(folder).replace("\\", "/") + "/"

        item["url"] = url
        item["path"] = str(folder).replace("\\", "/")
        item["gpu"] = is_gpu_item(item)
        items.append(item)

order = {"comparative": 0, "pilot-wave": 1, "foundations": 2}
items.sort(key=lambda x: (x.get("type", ""), order.get(x.get("category", ""), 99), x.get("title", "")))

with open("catalog.json", "w", encoding="utf-8") as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

print(f"Wrote catalog.json with {len(items)} entries")
