#!/usr/bin/env bash
# ==============================================================================
# Pichyy-Doc Production Build Script
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}          Building Pichyy-Doc for Production        ${NC}"
echo -e "${BLUE}====================================================${NC}"

# Check for node_modules
if [ ! -d node_modules ]; then
  echo -e "${YELLOW}! Installing dependencies first...${NC}"
  npm ci || npm install
fi

# Ensure Prisma Client is generated
if [ -f prisma/schema.prisma ]; then
  echo -e "\n${BLUE}[1/2] Generating Prisma Client...${NC}"
  npx prisma generate
fi

# Run Next.js production build
echo -e "\n${BLUE}[2/2] Compiling Next.js application...${NC}"
npm run build

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  ✓ Production build compiled successfully!         ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "Run ${YELLOW}./start.sh${NC} or ${YELLOW}npm run start${NC} to launch the production server.\n"
