#!/usr/bin/env python3
import argparse
import html
import json
import os
from pathlib import Path


def load_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def inject(target, script_src, attributes):
    if not target.is_file():
        raise FileNotFoundError(f"Feedback target does not exist: {target}")
    page = target.read_text(encoding="utf-8")
    if "data-qontic-feedback" in page:
        return False
    attribute_html = " ".join(
        f'data-{name}="{html.escape(str(value), quote=True)}"'
        for name, value in attributes.items()
        if value
    )
    tag = f'<script src="{html.escape(script_src, quote=True)}" data-qontic-feedback="true" {attribute_html}></script>'
    if "</body>" not in page.lower():
        raise ValueError(f"Feedback target has no closing body tag: {target}")
    position = page.lower().rfind("</body>")
    page = page[:position] + tag + "\n" + page[position:]
    target.write_text(page, encoding="utf-8")
    return True


def relative_script(target, site_root):
    return Path(os.path.relpath(site_root / "feedback.js", target.parent)).as_posix()


def main():
    parser = argparse.ArgumentParser(description="Inject the Q-Ontic feedback widget into deployed pages.")
    parser.add_argument("source_root", type=Path)
    parser.add_argument("site_root", type=Path)
    args = parser.parse_args()
    source_root = args.source_root.resolve()
    site_root = args.site_root.resolve()
    modules = {}
    for path in (source_root / "modules").glob("*.json"):
        module = load_json(path)
        modules[module["id"]] = module

    count = 0
    for root_name in ("apps", "notebooks"):
        for meta_path in (source_root / root_name).rglob("app.json"):
            resource = load_json(meta_path)
            relative_folder = meta_path.parent.relative_to(source_root)
            target = site_root / relative_folder / resource.get("entry", "index.html")
            module = modules.get(resource.get("module"), {})
            attributes = {
                "feedback-kind": "resource",
                "feedback-id": resource.get("id") or relative_folder.as_posix(),
                "feedback-title": resource.get("title", "Q-Ontic resource"),
                "module-id": resource.get("module"),
                "module-title": module.get("title")
            }
            count += inject(target, relative_script(target, site_root), attributes)

    for module_id, module in modules.items():
        target = site_root / "modules" / module_id / "index.html"
        attributes = {
            "feedback-kind": "module",
            "feedback-id": module_id,
            "feedback-title": module.get("title", module_id)
        }
        count += inject(target, relative_script(target, site_root), attributes)

    print(f"Injected feedback widget into {count} pages")


if __name__ == "__main__":
    main()
