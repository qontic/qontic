#!/usr/bin/env python3
import html
import json
import re
import sys
from pathlib import Path

RESOURCE_ROOTS = [Path("apps"), Path("notebooks")]
MODULE_ROOT = Path("modules")
COLLECTION_ROOT = Path("collections")
COURSE_ROOT = Path("courses")


def load_json(path):
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"Could not read {path}: {exc}") from exc


def slugify(value):
    value = re.sub(r"[^a-z0-9]+", "-", str(value).lower()).strip("-")
    return value or "untitled"


def is_gpu_item(item):
    if item.get("gpu") is True:
        return True
    fields = [item.get("title", ""), item.get("description", "")]
    tags = item.get("tags", [])
    fields.extend(tags if isinstance(tags, list) else [])
    blob = " ".join(str(field) for field in fields).lower()
    return any(keyword in blob for keyword in ("webgpu", "webgl2", "webgl", "gpu"))


def load_resources(warnings, errors):
    resources = []
    seen_ids = {}
    for root in RESOURCE_ROOTS:
        if not root.exists():
            continue
        for meta_path in sorted(root.rglob("app.json")):
            folder = meta_path.parent
            try:
                item = load_json(meta_path)
            except ValueError as exc:
                errors.append(str(exc))
                continue
            resource_id = item.get("id")
            if not resource_id:
                resource_id = slugify(str(folder).replace("\\", "/"))
                item["id"] = resource_id
                item["legacyGeneratedId"] = True
                warnings.append(f"{meta_path} has no stable id; temporarily generated '{resource_id}'")
            if resource_id in seen_ids:
                errors.append(f"Duplicate resource id '{resource_id}' in {meta_path} and {seen_ids[resource_id]}")
                continue
            seen_ids[resource_id] = meta_path
            entry = item.get("entry", "index.html")
            url = str(folder / entry).replace("\\", "/")
            if entry == "index.html":
                url = str(folder).replace("\\", "/") + "/"
            item["url"] = url
            item["path"] = str(folder).replace("\\", "/")
            item["gpu"] = is_gpu_item(item)
            resources.append(item)
    order = {"comparative": 0, "pilot-wave": 1, "foundations": 2}
    resources.sort(key=lambda item: (item.get("type", ""), order.get(item.get("category", ""), 99), item.get("title", "")))
    return resources


def load_modules(errors):
    modules = []
    seen_ids = {}
    if not MODULE_ROOT.exists():
        return modules
    for path in sorted(MODULE_ROOT.glob("*.json")):
        try:
            module = load_json(path)
        except ValueError as exc:
            errors.append(str(exc))
            continue
        module_id = module.get("id")
        if not module_id:
            errors.append(f"{path} is missing required field 'id'")
            continue
        if module_id in seen_ids:
            errors.append(f"Duplicate module id '{module_id}' in {path} and {seen_ids[module_id]}")
            continue
        seen_ids[module_id] = path
        modules.append(module)
    modules.sort(key=lambda module: (module.get("order", 999), module.get("title", "")))
    return modules


def load_collection_directory(root, default_type, errors, seen_ids):
    collections = []
    if not root.exists():
        return collections
    for path in sorted(root.glob("*.json")):
        if path.name.startswith("_"):
            continue
        try:
            collection = load_json(path)
        except ValueError as exc:
            errors.append(str(exc))
            continue
        collection_id = collection.get("id")
        if not collection_id:
            errors.append(f"{path} is missing required field 'id'")
            continue
        if collection_id in seen_ids:
            errors.append(f"Duplicate collection id '{collection_id}' in {path} and {seen_ids[collection_id]}")
            continue
        collection.setdefault("type", default_type)
        collection["source"] = str(path).replace("\\", "/")
        seen_ids[collection_id] = path
        collections.append(collection)
    return collections


def load_collections(errors):
    seen_ids = {}
    collections = []
    collections.extend(load_collection_directory(COLLECTION_ROOT, "collection", errors, seen_ids))
    collections.extend(load_collection_directory(COURSE_ROOT, "course", errors, seen_ids))
    collections.sort(key=lambda collection: (collection.get("order", 999), collection.get("title", "")))
    return collections


def validate_collection_structure(collection, errors):
    sections = collection.get("sections")
    if not isinstance(sections, list):
        errors.append(f"Collection '{collection['id']}' must contain a 'sections' array")
        return
    seen_section_ids = set()
    for index, section in enumerate(sections, start=1):
        if not isinstance(section, dict):
            errors.append(f"Collection '{collection['id']}' section {index} must be an object")
            continue
        section_id = section.get("id")
        if section_id:
            if section_id in seen_section_ids:
                errors.append(f"Collection '{collection['id']}' has duplicate section id '{section_id}'")
            seen_section_ids.add(section_id)
        if not section.get("title"):
            errors.append(f"Collection '{collection['id']}' section {index} is missing 'title'")
        if not isinstance(section.get("items"), list):
            errors.append(f"Collection '{collection['id']}' section '{section.get('title', index)}' must contain an 'items' array")


def validate_references(resources, modules, collections, errors):
    resource_ids = {item["id"] for item in resources}
    module_ids = {module["id"] for module in modules}
    for item in resources:
        module_id = item.get("module")
        if module_id and module_id not in module_ids:
            errors.append(f"Resource '{item['id']}' references unknown module '{module_id}'")
    for module in modules:
        for related_id in module.get("relatedModules", []):
            if related_id not in module_ids:
                errors.append(f"Module '{module['id']}' references unknown related module '{related_id}'")
    for collection in collections:
        validate_collection_structure(collection, errors)
        for section in collection.get("sections", []):
            if not isinstance(section, dict):
                continue
            for entry in section.get("items", []):
                if not isinstance(entry, dict):
                    errors.append(f"Collection '{collection['id']}' has a non-object item")
                    continue
                entry_type = entry.get("type")
                entry_id = entry.get("id")
                if entry_type == "module" and entry_id not in module_ids:
                    errors.append(f"Collection '{collection['id']}' references unknown module '{entry_id}'")
                elif entry_type == "resource" and entry_id not in resource_ids:
                    errors.append(f"Collection '{collection['id']}' references unknown resource '{entry_id}'")
                elif entry_type not in {"module", "resource"}:
                    errors.append(f"Collection '{collection['id']}' has item with invalid type '{entry_type}'")


def attach_resources_to_modules(resources, modules):
    by_module = {module["id"]: [] for module in modules}
    for resource in resources:
        module_id = resource.get("module")
        if module_id in by_module:
            by_module[module_id].append(resource["id"])
    enriched = []
    for module in modules:
        copy = dict(module)
        copy["resources"] = by_module[module["id"]]
        copy["url"] = f"modules/{module['id']}/"
        enriched.append(copy)
    return enriched


def resource_type_label(resource):
    labels = {"app": "Simulation", "notebook": "Notebook", "video": "Video", "activity": "Activity", "paper": "Reading"}
    return labels.get(resource.get("type"), str(resource.get("type", "Resource")).replace("-", " ").title())


def render_resource_list(resources):
    if not resources:
        return '<p class="empty">Resources for this module are being prepared.</p>'
    groups = []
    for resource in resources:
        tags = [resource_type_label(resource)]
        if resource.get("category"):
            tags.append(str(resource["category"]).replace("-", " ").title())
        tag_html = "".join(f'<span class="tag">{html.escape(tag)}</span>' for tag in tags)
        status = str(resource.get("status", "published")).lower()
        if status != "published":
            tag_html += f'<span class="tag status {html.escape(status, quote=True)}">{html.escape(status.title())}</span>'
        groups.append(
            '<article class="resource-row">'
            f'<div><h3>{html.escape(resource.get("title", "Untitled resource"))}</h3>'
            f'<p>{html.escape(resource.get("description", ""))}</p>'
            f'<div class="tags">{tag_html}</div></div>'
            f'<a class="open" href="../../{html.escape(resource["url"], quote=True)}">Open →</a>'
            '</article>'
        )
    return "".join(groups)


def generate_module_pages(resources, modules):
    by_module = {module["id"]: [] for module in modules}
    for resource in resources:
        module_id = resource.get("module")
        if module_id in by_module:
            by_module[module_id].append(resource)
    module_lookup = {module["id"]: module for module in modules}

    for module in modules:
        output_dir = MODULE_ROOT / module["id"]
        output_dir.mkdir(parents=True, exist_ok=True)
        related_links = []
        for related_id in module.get("relatedModules", []):
            related = module_lookup.get(related_id)
            if related:
                related_links.append(f'<a href="../{html.escape(related_id, quote=True)}/">{html.escape(related.get("title", related_id))}</a>')
        related_html = ""
        if related_links:
            related_html = '<section class="related"><h2>Related modules</h2><p>' + " · ".join(related_links) + '</p></section>'
        topic_html = "".join(f'<span class="topic">{html.escape(str(topic).replace("-", " ").title())}</span>' for topic in module.get("topics", []))
        page = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(module.get("title", "Module"))} — Q-Ontic Lab</title>
  <meta name="description" content="{html.escape(module.get("summary", ""), quote=True)}" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZWF6YQM0YV"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){{dataLayer.push(arguments);}}
    gtag('js', new Date());
    gtag('config', 'G-ZWF6YQM0YV');
  </script>
  <style>
    :root {{ --blue:#003366; --blue2:#0055aa; --bg:#f7f8fb; --border:#dbe3f0; --text:#263238; --muted:#5f6b7a; }}
    * {{ box-sizing:border-box; }} body {{ margin:0; font-family:"Segoe UI",system-ui,sans-serif; background:var(--bg); color:var(--text); line-height:1.5; }}
    header {{ background:linear-gradient(135deg,#00264d,#004080); color:white; padding:1.5rem 1rem; }}
    .header-inner, main {{ max-width:900px; margin:auto; }} .back {{ color:#d7eaff; text-decoration:none; font-size:.9rem; }}
    h1 {{ margin:.55rem 0 .35rem; font-size:2rem; }} .summary {{ margin:0; max-width:760px; opacity:.94; }}
    main {{ padding:1.5rem 1rem 2.5rem; }} .topics {{ display:flex; flex-wrap:wrap; gap:.35rem; margin:0 0 1.5rem; }}
    .topic, .tag {{ display:inline-block; background:#e8eef6; color:#34495e; border-radius:999px; padding:.2rem .55rem; font-size:.75rem; }}
    .tag.status {{ background:#fff0c2; color:#7a5200; border:1px solid #e5bd55; font-weight:700; }}
    .tag.status.review {{ background:#e8f1ff; color:#174f91; border-color:#9bbce4; }}
    h2 {{ color:var(--blue); border-bottom:2px solid var(--blue); padding-bottom:.3rem; margin:0 0 .35rem; }}
    .resource-list {{ background:white; border:1px solid var(--border); border-radius:8px; overflow:hidden; }}
    .resource-row {{ display:grid; grid-template-columns:1fr auto; gap:1rem; align-items:center; padding:1rem; border-bottom:1px solid var(--border); }}
    .resource-row:last-child {{ border-bottom:0; }} .resource-row h3 {{ margin:0 0 .25rem; color:var(--blue); font-size:1.05rem; }}
    .resource-row p {{ margin:0 0 .5rem; color:#44515f; font-size:.92rem; }} .tags {{ display:flex; gap:.3rem; flex-wrap:wrap; }}
    .open {{ color:white; background:var(--blue2); padding:.45rem .7rem; border-radius:5px; text-decoration:none; font-weight:700; white-space:nowrap; }}
    .empty {{ color:var(--muted); font-style:italic; padding:1rem; }} .related {{ margin-top:2rem; }} .related a {{ color:var(--blue2); }}
    footer {{ text-align:center; padding:1.2rem; border-top:1px solid var(--border); background:#eef2f7; color:var(--muted); font-size:.85rem; }}
    @media(max-width:650px) {{ .resource-row {{ grid-template-columns:1fr; }} .open {{ justify-self:start; }} }}
  </style>
</head>
<body>
<header><div class="header-inner"><a class="back" href="../../">← All modules</a><h1>{html.escape(module.get("title", "Module"))}</h1><p class="summary">{html.escape(module.get("summary", ""))}</p></div></header>
<main>
  <div class="topics">{topic_html}</div>
  <section><h2>Resources</h2><div class="resource-list">{render_resource_list(by_module[module["id"]])}</div></section>
  {related_html}
</main>
<footer>Q-Ontic Lab · Rice University</footer>
</body>
</html>
'''
        (output_dir / "index.html").write_text(page, encoding="utf-8")


def main():
    warnings = []
    errors = []
    resources = load_resources(warnings, errors)
    modules = load_modules(errors)
    collections = load_collections(errors)
    validate_references(resources, modules, collections, errors)
    for warning in warnings:
        print(f"WARNING: {warning}", file=sys.stderr)
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)

    with open("catalog.json", "w", encoding="utf-8") as handle:
        json.dump(resources, handle, indent=2, ensure_ascii=False)

    enriched_modules = attach_resources_to_modules(resources, modules)
    site_data = {
        "modules": enriched_modules,
        "resources": resources,
        "collections": collections,
        "courses": [collection for collection in collections if collection.get("type") == "course"],
    }
    with open("site-data.json", "w", encoding="utf-8") as handle:
        json.dump(site_data, handle, indent=2, ensure_ascii=False)

    generate_module_pages(resources, modules)
    print(f"Wrote catalog.json, site-data.json, and {len(modules)} module pages with {len(resources)} resources and {len(collections)} collections")


if __name__ == "__main__":
    main()
