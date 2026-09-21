#!/usr/bin/env bash
# ==============================================================================
# Pichyy-Doc Production Server Runner Script
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}         Starting Pichyy-Doc Production Server      ${NC}"
echo -e "${BLUE}====================================================${NC}"

if [ ! -d .next ]; then
  echo -e "Build directory .next not found. Running build first..."
  ./build.sh
fi

echo -e "${GREEN}✓ Launching Next.js production server on port 3000...${NC}\n"
npm run start
