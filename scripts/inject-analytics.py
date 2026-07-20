#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


MARKER = 'data-qsf-analytics="true"'


class AnalyticsScriptParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sources = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() != "script":
            return
        attributes = dict(attrs)
        if attributes.get("data-qsf-analytics") == "true":
            self.sources.append(attributes.get("src", ""))


def load_json(path):
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def relative_script(target, site_root):
    helper = site_root / "shared" / "qsf-analytics.js"
    version = hashlib.sha256(helper.read_bytes()).hexdigest()[:12]
    path = Path(os.path.relpath(helper, target.parent)).as_posix()
    return f"{path}?v={version}"


def inject(target, site_root):
    if not target.is_file():
        raise FileNotFoundError(f"Analytics target does not exist: {target}")

    page = target.read_text(encoding="utf-8")
    if MARKER in page:
        return False

    closing_body = page.lower().rfind("</body>")
    if closing_body < 0:
        raise ValueError(f"Analytics target has no closing body tag: {target}")

    script_src = relative_script(target, site_root)
    tag = f'<script src="{script_src}" data-qsf-analytics="true" defer></script>'
    page = page[:closing_body] + tag + "\n" + page[closing_body:]
    target.write_text(page, encoding="utf-8")
    return True


def validate(target, site_root):
    parser = AnalyticsScriptParser()
    parser.feed(target.read_text(encoding="utf-8"))
    if len(parser.sources) != 1:
        raise ValueError(f"Expected one standard Analytics helper in {target}; found {len(parser.sources)}")
    source = parser.sources[0]
    source_url = urlsplit(source)
    resolved = (target.parent / source_url.path).resolve()
    expected = (site_root / "shared" / "qsf-analytics.js").resolve()
    if resolved != expected or not resolved.is_file() or not source_url.query.startswith("v="):
        raise ValueError(f"Analytics helper in {target} does not resolve to {expected}: {source}")


def deployment_targets(source_root, site_root):
    targets = []

    for name in ("index.html", "collaborators.html", "multi.html"):
        target = site_root / name
        if target.is_file():
            targets.append(target)

    for root_name in ("apps", "notebooks"):
        for meta_path in (source_root / root_name).rglob("app.json"):
            resource = load_json(meta_path)
            relative_folder = meta_path.parent.relative_to(source_root)
            targets.append(site_root / relative_folder / resource.get("entry", "index.html"))

    for module_path in (source_root / "modules").glob("*.json"):
        module = load_json(module_path)
        targets.append(site_root / "modules" / module["id"] / "index.html")

    return list(dict.fromkeys(targets))


def main():
    parser = argparse.ArgumentParser(description="Inject standard Q-Ontic Analytics into deployed pages.")
    parser.add_argument("source_root", type=Path)
    parser.add_argument("site_root", type=Path)
    args = parser.parse_args()
    source_root = args.source_root.resolve()
    site_root = args.site_root.resolve()

    helper = site_root / "shared" / "qsf-analytics.js"
    if not helper.is_file():
        raise FileNotFoundError(f"Analytics helper does not exist: {helper}")

    targets = deployment_targets(source_root, site_root)
    count = sum(inject(target, site_root) for target in targets)
    for target in targets:
        validate(target, site_root)
    print(f"Standardized Analytics on {len(targets)} pages; injected helper into {count} pages")


if __name__ == "__main__":
    main()
