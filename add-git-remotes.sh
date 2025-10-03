#!/bin/bash

# Check if username provided
if [ -z "$1" ]; then
  echo "❌ Error: GitHub username required"
  echo "Usage: ./add-git-remotes.sh YOUR_GITHUB_USERNAME"
  exit 1
fi

GITHUB_USERNAME=$1

echo "🔗 Adding Git remotes for GitHub user: $GITHUB_USERNAME"
echo "========================================================"
echo ""

# Array of repositories
repos=("mindsphere-frontend" "mindsphere-backend" "mindsphere-ai-agent" "mindsphere-mobile")

for repo in "${repos[@]}"; do
  echo "📁 $repo"
  
  if [ ! -d "$repo" ]; then
    echo "   ❌ Directory not found, skipping..."
    continue
  fi
  
  cd "$repo" || exit
  
  # Check if remote already exists
  if git remote get-url origin &> /dev/null; then
    echo "   ⚠️  Remote 'origin' already exists:"
    echo "   $(git remote get-url origin)"
    read -p "   Replace it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      git remote remove origin
      echo "   🗑️  Removed existing remote"
    else
      echo "   ⏭️  Skipping..."
      cd ..
      continue
    fi
  fi
  
  # Add remote
  git remote add origin "https://github.com/$GITHUB_USERNAME/$repo.git"
  echo "   ✅ Remote added: https://github.com/$GITHUB_USERNAME/$repo.git"
  
  # Ask if they want to push
  read -p "   Push to GitHub now? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -u origin main
    echo "   ✅ Pushed to GitHub"
  else
    echo "   ⏭️  Skipped push (you can push later with: git push -u origin main)"
  fi
  
  echo ""
  cd ..
done

echo "✅ Done!"
echo ""
echo "🎉 Your repositories are now connected to GitHub!"
echo ""
echo "View them at:"
for repo in "${repos[@]}"; do
  echo "  → https://github.com/$GITHUB_USERNAME/$repo"
done

