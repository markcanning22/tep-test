#!/usr/bin/env sh

set -e

SCRIPT_DIR=$(dirname "$(realpath "$0")")
TARGET=""
SKIP_APP_DEPLOYS=false
SKIP_CLOUDFORMATION=false

while [ $# -gt 0 ]; do
  case "$1" in
    --target=*)
      TARGET="${1#*=}"
      ;;
    --skip-app-deploys)
      SKIP_APP_DEPLOYS=true
      ;;
    --skip-cloudformation)
      SKIP_CLOUDFORMATION=true
      ;;
    *)
      echo "Unknown parameter: $1"
      exit 1
      ;;
  esac
  shift
done

if [ -z "$TARGET" ]; then
  echo "Error: --target is required"
  echo "Usage: $0 --target=<value> [--skip-app-deploys]"
  exit 1
fi

if [ ! "$SKIP_CLOUDFORMATION" = true ]; then
  if ! aws s3api head-bucket --bucket "tep-test-$TARGET-cfn" 2>/dev/null; then
    echo "Creating CloudFormation bucket"
    aws s3 mb "s3://tep-test-$TARGET-cfn"
  fi

  if ! aws s3api head-bucket --bucket "tep-test-$TARGET-lambda-functions" 2>/dev/null; then
    echo "Creating lambda functions bucket"
    aws s3 mb "s3://tep-test-$TARGET-lambda-functions"
  fi

  echo "Cleaning bucket"
  aws s3 rm "s3://tep-test-$TARGET-cfn" --recursive

  echo "Beginning deployment of eu-west-2 resources"

  echo "Packaging"
  aws cloudformation package \
    --template-file "$SCRIPT_DIR/../infra/src/stacks/$TARGET/eu-west-2/stack.yml" \
    --s3-bucket "tep-test-$TARGET-cfn" \
    --output-template-file "$SCRIPT_DIR/../infra/dist/$TARGET-eu-west-2-output.yml"

  echo "Deploying"
  aws cloudformation deploy \
    --stack-name "TEPTest-$TARGET" \
    --template-file "$SCRIPT_DIR/../infra/dist/$TARGET-eu-west-2-output.yml" \
    --region "eu-west-2" \
    --capabilities CAPABILITY_NAMED_IAM
fi

if [ ! "$SKIP_APP_DEPLOYS" = true ]; then
  echo "Deploying User API"
  sh "$SCRIPT_DIR/deploy-user-api.sh" "$TARGET"
fi
