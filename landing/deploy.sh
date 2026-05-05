#!/usr/bin/env bash
# Deploy landing page to bonner-gpu.rice.edu
# Pushes index.html + apps.json to BOTH production and dev roots.
# Usage:
#   ./deploy.sh             — commit, push, then deploy
#   ./deploy.sh --no-commit — skip git commit/push, just deploy
set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LANDING_DIR="$REPO_ROOT/landing"
REMOTE_HOST="bonner-gpu.rice.edu"
PROD_PATH="/var/www/html/bonner-gpu/bm"
DEV_PATH="/var/www/html/bonner-gpu/bm/dev"

# ── 1. Commit & push source (unless --no-commit) ──────────────────────────
if [[ "$1" != "--no-commit" ]]; then
  cd "$REPO_ROOT"
  git add -A
  git diff --cached --quiet && echo "Nothing to commit." || git commit -m "landing: deploy $(date '+%Y-%m-%d')"
  git push
fi

# ── 2. Deploy to production (/bm/) ────────────────────────────────────────
echo "→ Deploying to production: $REMOTE_HOST:$PROD_PATH/"
rsync -az --info=progress2 \
  "$LANDING_DIR/index.html" \
  "$LANDING_DIR/apps.json" \
  "$LANDING_DIR/collaborators.html" \
  "$LANDING_DIR/images/" \
  "$REMOTE_HOST:$PROD_PATH/"

# ── 3. Deploy to dev (/bm/dev/) ───────────────────────────────────────────
echo "→ Deploying to dev: $REMOTE_HOST:$DEV_PATH/"
rsync -az --info=progress2 \
  "$LANDING_DIR/index.html" \
  "$LANDING_DIR/apps.json" \
  "$LANDING_DIR/collaborators.html" \
  "$LANDING_DIR/images/" \
  "$REMOTE_HOST:$DEV_PATH/"

echo ""
echo "✓ Production: http://qonticlab.rice.edu/"
echo "✓ Dev:        http://bonner-gpu.rice.edu/bonner-gpu/bm/dev/"
