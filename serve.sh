#!/usr/bin/env bash
# Local preview server — mirrors production layout exactly.
# Builds all Vite apps, assembles a _site/ staging dir, then serves it.
#
# Usage:
#   ./serve.sh            — build all + serve on :8787
#   ./serve.sh --no-build — skip builds (use existing dist/), just reassemble + serve
#   ./serve.sh --port N   — use port N (default 8787)
set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE="$REPO_ROOT/_site"
PORT=8787

# ── Parse args ──────────────────────────────────────────────────────────────
NO_BUILD=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-build) NO_BUILD=true ;;
    --port)     PORT="$2"; shift ;;
  esac
  shift
done

# ── 1. Build Vite apps ───────────────────────────────────────────────────────
VITE_APPS=(stern-gerlach measurement bell-experiment)
if [[ "$NO_BUILD" == false ]]; then
  for app in "${VITE_APPS[@]}"; do
    echo "→ Building $app…"
    (cd "$REPO_ROOT/$app" && npm run build 2>&1 | grep -E '✓|Error|error')
  done
fi

# ── 2. Assemble _site/ ───────────────────────────────────────────────────────
echo "→ Assembling _site/…"
rm -rf "$SITE"
mkdir -p "$SITE"

# Landing page + static assets
rsync -a --exclude='_site' --exclude='archive' --exclude='dev' \
  --exclude='*/node_modules' --exclude='*/src' --exclude='*/dist' \
  --exclude='*.jsx' --exclude='*.ts' --exclude='*.tsx' \
  --exclude='vite.config.*' --exclude='package*.json' \
  --exclude='serve.sh' --exclude='deploy.sh' --exclude='*.sh' \
  "$REPO_ROOT/" "$SITE/"

# Overlay each Vite app's dist/ over its slot in _site/
for app in "${VITE_APPS[@]}"; do
  rsync -a "$REPO_ROOT/$app/dist/" "$SITE/$app/"
done

# Dev area
if [[ -d "$REPO_ROOT/dev/2d-measurement/dist" ]]; then
  mkdir -p "$SITE/dev"
  rsync -a "$REPO_ROOT/dev/index.html" "$REPO_ROOT/dev/apps.json" "$SITE/dev/"
  rsync -a "$REPO_ROOT/dev/2d-measurement/dist/" "$SITE/dev/2d-measurement/"
fi

echo ""
echo "✓ Site assembled at _site/"
echo "→ Serving at http://127.0.0.1:$PORT/"
echo "   Press Ctrl-C to stop."
echo ""
cd "$SITE" && python3 -m http.server "$PORT" --bind 127.0.0.1
