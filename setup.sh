#!/usr/bin/env bash
# ==============================================================================
# Pichyy-Doc Setup Script
# Automatically verifies environment, sets up config, and installs dependencies.
# ==============================================================================

set -e

# ANSI Color Codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}====================================================${NC}"
echo -e "${BLUE}        Pichyy-Doc Automated Platform Setup        ${NC}"
echo -e "${BLUE}====================================================${NC}"

# 1. Check Node.js
echo -e "\n${BLUE}[1/5] Checking Node.js environment...${NC}"
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}Error: Node.js is not installed! Please install Node.js (v18.18+ or v20+ LTS).${NC}"
  exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js detected: ${NODE_VERSION}${NC}"

# 2. Check Package Manager
echo -e "\n${BLUE}[2/5] Checking package manager...${NC}"
if command -v npm >/dev/null 2>&1; then
  PKG_MANAGER="npm"
elif command -v pnpm >/dev/null 2>&1; then
  PKG_MANAGER="pnpm"
elif command -v yarn >/dev/null 2>&1; then
  PKG_MANAGER="yarn"
else
  echo -e "${RED}Error: Neither npm, pnpm, nor yarn was detected!${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Using package manager: ${PKG_MANAGER}${NC}"

# 3. Setup Environment File
echo -e "\n${BLUE}[3/5] Checking environment configuration (.env)...${NC}"
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env from .env.example${NC}"
  else
    echo -e "${YELLOW}! No .env.example found. Creating default .env...${NC}"
    cat <<EOF > .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pichyydoc?schema=public"
ADMIN_PIN="123456"
SESSION_SECRET="pichyy-doc-secret-$(date +%s)"
NODE_ENV="development"
EOF
    echo -e "${GREEN}✓ Default .env created.${NC}"
  fi
else
  echo -e "${GREEN}✓ Existing .env detected.${NC}"
fi

# 4. Install Dependencies
echo -e "\n${BLUE}[4/5] Installing project dependencies...${NC}"
$PKG_MANAGER install
echo -e "${GREEN}✓ Dependencies installed successfully.${NC}"

# 5. Initialize Prisma Client & Directories
echo -e "\n${BLUE}[5/5] Preparing Prisma client and local storage directories...${NC}"
mkdir -p data public/uploads
touch public/uploads/.gitkeep

if [ -f prisma/schema.prisma ]; then
  npx prisma generate
  echo -e "${GREEN}✓ Prisma Client generated.${NC}"
fi

echo -e "\n${GREEN}====================================================${NC}"
echo -e "${GREEN}  ✓ Pichyy-Doc setup completed successfully!        ${NC}"
echo -e "${GREEN}====================================================${NC}"
echo -e "\nNext steps:"
echo -e "  Run dev server:       ${YELLOW}./dev.sh${NC}  or  ${YELLOW}npm run dev${NC}"
echo -e "  Compile build:        ${YELLOW}./build.sh${NC} or  ${YELLOW}npm run build${NC}"
echo -e "  Open documentation:   ${BLUE}http://localhost:3000${NC}"
echo -e "  Admin console PIN:    ${YELLOW}123456${NC} (configured in .env)\n"
