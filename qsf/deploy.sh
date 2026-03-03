#!/bin/bash
set -e

REMOTE_USER="pyepes"
REMOTE_HOST="bonner-gpu.rice.edu"
REMOTE_PATH="/var/www/html/bonner-gpu/bm/qsfv2"

echo "Building..."
npm run build

echo "Creating remote directory if needed..."
ssh "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH"

echo "Deploying to $REMOTE_HOST:$REMOTE_PATH ..."
rsync -avz --delete dist/ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo "Done. Live at: http://qonticlab.rice.edu/qsfv2/"
