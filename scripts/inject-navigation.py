#!/usr/bin/env python3
"""Add shared return navigation to deployed teaching pages, including standalone applets."""
import argparse,hashlib,os
from pathlib import Path

def inject_navigation(root):
    helper=root/'shared/qontic-return.js'
    version=hashlib.sha256(helper.read_bytes()).hexdigest()[:12]
    targets=[root/'index.html']
    for name in ['apps','notebooks','modules']:
        targets.extend((root/name).rglob('*.html'))
    count=0
    for target in targets:
        if not target.is_file():continue
        page=target.read_text(encoding='utf-8')
        if 'data-qontic-return="true"' in page:continue
        at=page.lower().rfind('</body>')
        if at<0:continue
        relative=Path(os.path.relpath(helper,target.parent)).as_posix()
        page=page[:at]+f'<script defer src="{relative}?v={version}" data-qontic-return="true"></script>\n'+page[at:]
        target.write_text(page,encoding='utf-8');count+=1
    return count

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('site_root',type=Path)
    args=parser.parse_args();print(f'Added return navigation to {inject_navigation(args.site_root.resolve())} teaching pages')
