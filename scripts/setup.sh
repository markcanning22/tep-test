#!/usr/bin/env sh

set -e

npx yarn

cp apps/user/.env.example apps/user/.env
