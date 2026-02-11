#!/bin/bash
set -e

BUCKET="liaowill-map-quiz"
DISTRIBUTION_ID="E3EULTR53TJOJS"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Syncing files to S3..."
aws s3 sync "$DIR/" "s3://$BUCKET/" \
  --exclude ".claude/*" --exclude ".git/*" --exclude "deploy.sh" --exclude "README.md" --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" --query 'Invalidation.Id' --output text

echo "Done! Site will update within a few seconds."
