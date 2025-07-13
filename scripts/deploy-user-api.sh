#!/usr/bin/env sh

set -e

SCRIPT_DIR=$(dirname "$(realpath "$0")")/

if [ -z "$1" ]; then
  echo "Error: Missing target"
  exit 1
fi

TARGET=$1

echo "Building User API..."

rm -rf "$SCRIPT_DIR/../apps/user/dist"
rm -rf "$SCRIPT_DIR/../infra/tmp/user-api.zip"

cd "$SCRIPT_DIR/../"
NX_TUI=false npx nx run "user:build:$TARGET" --skip-nx-cache

cd "$SCRIPT_DIR/../apps/user/dist"
zip -r "$SCRIPT_DIR/../infra/tmp/user-api.zip" .

echo "Uploading User API to S3..."

aws s3 cp "$SCRIPT_DIR/../infra/tmp/user-api.zip" "s3://tep-test-$TARGET-lambda-functions"

echo "Updating User API lambda..."

aws lambda update-function-code --function-name UserApiLambda \
  --s3-bucket "tep-test-$TARGET-lambda-functions" \
  --s3-key user-api.zip \
  --no-cli-pager
