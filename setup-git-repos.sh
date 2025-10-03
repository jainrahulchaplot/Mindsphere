#!/bin/bash

echo "🔀 Setting up Separate Git Repositories"
echo "========================================"
echo ""
echo "This will initialize Git in each service directory"
echo "and create proper .gitignore files."
echo ""

# Array of repositories
declare -A repos=(
  ["mindsphere-frontend"]="React + TypeScript Frontend"
  ["mindsphere-backend"]="Express.js Backend API"
  ["mindsphere-ai-agent"]="LiveKit AI Voice Agent"
  ["mindsphere-mobile"]="React Native Mobile App"
)

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter
count=1
total=${#repos[@]}

for repo in "${!repos[@]}"; do
  description="${repos[$repo]}"
  echo -e "${BLUE}[$count/$total]${NC} Setting up: $repo"
  echo "    Description: $description"
  
  if [ ! -d "$repo" ]; then
    echo "    ❌ Directory not found: $repo"
    continue
  fi
  
  cd "$repo" || exit
  
  # Check if already initialized
  if [ -d ".git" ]; then
    echo "    ⚠️  Git already initialized, skipping..."
    cd ..
    ((count++))
    continue
  fi
  
  # Initialize git
  git init -b main
  echo "    ✅ Git initialized"
  
  # Create comprehensive .gitignore
  cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js
package-lock.json
pnpm-lock.yaml
yarn.lock

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.*.local
*.env
!.env.example
!env.example

# Build outputs
dist/
build/
.next/
out/
.cache/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*
server.log
frontend.log
backend.log

# Testing
coverage/
.nyc_output/
*.lcov

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.project
.classpath
.settings/
*.sublime-project
*.sublime-workspace

# Temporary files
tmp/
temp/
*.tmp

# Uploads (for backend)
uploads/*.webm
uploads/*.mp3
uploads/*.wav
uploads/*.m4a
!uploads/.gitkeep

# Misc
.turbo/
.parcel-cache/
EOF

  echo "    ✅ .gitignore created"
  
  # Create .gitkeep for uploads directory if it exists
  if [ -d "uploads" ]; then
    touch uploads/.gitkeep
    echo "    ✅ uploads/.gitkeep created"
  fi
  
  # Initial commit
  git add .
  git commit -m "feat: initial commit - $description

- Initialize repository structure
- Add comprehensive .gitignore
- Add README and documentation
- Configure package.json
- Set up environment templates"
  
  echo -e "    ${GREEN}✅ Initial commit created${NC}"
  echo ""
  
  cd ..
  ((count++))
done

echo ""
echo "✅ All repositories initialized!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  Create GitHub repositories:"
echo "   → https://github.com/new"
echo "   "
echo "   Create these 4 repositories:"
echo "   • mindsphere-frontend"
echo "   • mindsphere-backend"
echo "   • mindsphere-ai-agent"
echo "   • mindsphere-mobile"
echo ""
echo "2️⃣  Add remote origins (replace YOUR_USERNAME):"
echo ""
echo "   cd mindsphere-frontend"
echo "   git remote add origin https://github.com/YOUR_USERNAME/mindsphere-frontend.git"
echo "   git push -u origin main"
echo ""
echo "   cd ../mindsphere-backend"
echo "   git remote add origin https://github.com/YOUR_USERNAME/mindsphere-backend.git"
echo "   git push -u origin main"
echo ""
echo "   cd ../mindsphere-ai-agent"
echo "   git remote add origin https://github.com/YOUR_USERNAME/mindsphere-ai-agent.git"
echo "   git push -u origin main"
echo ""
echo "   cd ../mindsphere-mobile"
echo "   git remote add origin https://github.com/YOUR_USERNAME/mindsphere-mobile.git"
echo "   git push -u origin main"
echo ""
echo "3️⃣  Or use the helper script:"
echo "   ./add-git-remotes.sh YOUR_GITHUB_USERNAME"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

