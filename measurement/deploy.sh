#!/usr/bin/env bash
# Deploy measurement to bonner-gpu.rice.edu
# Usage: ./deploy.sh [--no-commit]
set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="$REPO_ROOT/measurement"
REMOTE_HOST="bonner-gpu.rice.edu"
REMOTE_PATH="/var/www/html/bonner-gpu/bm/measurement/"

# ── 1. Commit & push source (unless --no-commit) ──────────────────────────
if [[ "$1" != "--no-commit" ]]; then
  cd "$REPO_ROOT"
  git add -A
  git diff --cached --quiet && echo "Nothing to commit." || git commit -m "measurement: deploy $(date '+%Y-%m-%d')"
  git push
fi

# ── 2. Build ──────────────────────────────────────────────────────────────
cd "$APP_DIR"
npm run build

# ── 3. Rsync dist/ to server ──────────────────────────────────────────────
rsync -az --info=progress2 "$APP_DIR/dist/" \
  "$REMOTE_HOST:$REMOTE_PATH"

echo ""
echo "✓ Deployed to http://$REMOTE_HOST/bonner-gpu/bm/measurement/"
