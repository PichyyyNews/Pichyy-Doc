#!/usr/bin/env bash
# ==============================================================================
# Pichyy-Doc Development Launcher Script
# ==============================================================================

set -e

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}             Starting Pichyy-Doc (Dev)              ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Check for .env file
if [ ! -f .env ] && [ -f .env.example ]; then
  echo -e "${YELLOW}! .env not found. Copying from .env.example...${NC}"
  cp .env.example .env
fi

# Check for node_modules
if [ ! -d node_modules ]; then
  echo -e "${YELLOW}! node_modules not found. Running npm install...${NC}"
  npm install
fi

echo -e "${GREEN}✓ Launching Next.js development server on http://localhost:3000${NC}\n"
npm run dev
