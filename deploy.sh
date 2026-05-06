#!/usr/bin/env bash
# Deploy qonticlab to bonner-gpu.rice.edu
#
# Usage:
#   ./deploy.sh             — commit, push, build dev apps, then deploy all
#   ./deploy.sh --no-commit — skip git commit/push, just build & deploy
#   ./deploy.sh --prod-only — deploy production landing only (no dev build)
set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
REMOTE_HOST="bonner-gpu.rice.edu"
PROD_PATH="/var/www/html/bonner-gpu/bm"
DEV_PATH="/var/www/html/bonner-gpu/bm/dev"

# ── 1. Commit & push source (unless --no-commit) ──────────────────────────
if [[ "$1" != "--no-commit" ]]; then
  cd "$REPO_ROOT"
  git add -A
  git diff --cached --quiet && echo "Nothing to commit." || git commit -m "deploy $(date '+%Y-%m-%d')"
  git push
fi

# ── 2. Deploy to production (/bm/) ────────────────────────────────────────
echo "→ Deploying production landing: $REMOTE_HOST:$PROD_PATH/"
rsync -az --info=progress2 \
  "$REPO_ROOT/index.html" \
  "$REPO_ROOT/apps.json" \
  "$REPO_ROOT/collaborators.html" \
  "$REPO_ROOT/images/" \
  "$REMOTE_HOST:$PROD_PATH/"

[[ "$1" == "--prod-only" ]] && { echo "✓ Production only."; exit 0; }

# ── 3. Build dev apps ─────────────────────────────────────────────────────
echo "→ Building dev/2d-measurement…"
cd "$REPO_ROOT/dev/2d-measurement"
npm run build
cd "$REPO_ROOT"

# ── 4. Deploy dev landing + apps (/bm/dev/) ───────────────────────────────
echo "→ Deploying dev landing: $REMOTE_HOST:$DEV_PATH/"
rsync -az --info=progress2 \
  "$REPO_ROOT/dev/index.html" \
  "$REPO_ROOT/dev/apps.json" \
  "$REMOTE_HOST:$DEV_PATH/"

# ── 5. Deploy each dev app ────────────────────────────────────────────────
echo "→ Deploying dev/2d-measurement…"
rsync -az --info=progress2 \
  "$REPO_ROOT/dev/2d-measurement/dist/" \
  "$REMOTE_HOST:$DEV_PATH/2d-measurement/"

echo ""
echo "✓ Production: http://qonticlab.rice.edu/"
echo "✓ Dev:        http://bonner-gpu.rice.edu/bonner-gpu/bm/dev/"
