#!/bin/bash

# MindSphere - Push All Repositories Script
# This script pushes changes to all 5 Git repositories

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🚀 MINDSPHERE - PUSH ALL REPOSITORIES                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get commit message from user or use default
if [ -z "$1" ]; then
    echo -e "${YELLOW}No commit message provided. Using default.${NC}"
    COMMIT_MSG="chore: sync repositories"
else
    COMMIT_MSG="$1"
fi

echo -e "${BLUE}Commit message: ${NC}$COMMIT_MSG"
echo ""

# Function to push a repository
push_repo() {
    local repo_path=$1
    local repo_name=$2
    
    echo "─────────────────────────────────────────────────────────────"
    echo -e "${BLUE}📦 Processing: $repo_name${NC}"
    echo "─────────────────────────────────────────────────────────────"
    
    cd "$repo_path"
    
    # Check if there are changes
    if [[ -z $(git status -s) ]]; then
        echo -e "${YELLOW}   ⊘ No changes to commit${NC}"
        echo ""
        return
    fi
    
    # Show what will be committed
    echo -e "${GREEN}   Changes to commit:${NC}"
    git status -s | head -10
    if [ $(git status -s | wc -l) -gt 10 ]; then
        echo "   ... and $(($(git status -s | wc -l) - 10)) more files"
    fi
    echo ""
    
    # Add all changes
    git add .
    
    # Commit
    echo -e "${GREEN}   ✓ Committing changes...${NC}"
    git commit -m "$COMMIT_MSG" || echo -e "${YELLOW}   Note: Nothing new to commit${NC}"
    
    # Push
    echo -e "${GREEN}   ✓ Pushing to remote...${NC}"
    git push origin main
    
    echo -e "${GREEN}   ✅ $repo_name pushed successfully!${NC}"
    echo ""
}

# Base directory
BASE_DIR="/Users/rahul/Documents/Mindsphere V1 Separated"

# Push each repository
echo "════════════════════════════════════════════════════════════════"
echo "  PUSHING TO ALL REPOSITORIES"
echo "════════════════════════════════════════════════════════════════"
echo ""

# 1. Root repository (documentation)
push_repo "$BASE_DIR" "Root (Documentation)"

# 2. Backend repository
push_repo "$BASE_DIR/mindsphere-backend" "Backend"

# 3. Frontend repository
push_repo "$BASE_DIR/mindsphere-frontend" "Frontend"

# 4. AI Agent repository
push_repo "$BASE_DIR/mindsphere-ai-agent" "AI Agent"

# 5. Mobile repository
push_repo "$BASE_DIR/mindsphere-mobile" "Mobile"

# Summary
echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ ALL REPOSITORIES PUSHED SUCCESSFULLY!${NC}"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Pushed to:"
echo "  • github.com/jainrahulchaplot/Mindsphere (documentation)"
echo "  • github.com/jainrahulchaplot/mindsphere-backend"
echo "  • github.com/jainrahulchaplot/mindsphere-frontend"
echo "  • github.com/jainrahulchaplot/mindsphere-ai-agent"
echo "  • github.com/jainrahulchaplot/mindsphere-mobile"
echo ""
echo "🚀 Deployments triggered:"
echo "  • Railway: mindsphere-backend"
echo "  • Vercel: mindsphere-frontend"
echo ""

