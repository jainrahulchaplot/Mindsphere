#!/bin/bash
# Quick push script - Run this to push current changes

cd "/Users/rahul/Documents/Mindsphere V1 Separated"

echo "🚀 Pushing current changes to Git..."
echo ""

# Root repository
echo "📦 Pushing Root Repository..."
git add .
git commit -m "docs: add automated push script and guide" || echo "Nothing to commit in root"
git push origin main
echo "✅ Root repository pushed!"
echo ""

# Check other repos
cd mindsphere-backend
if [[ ! -z $(git status -s) ]]; then
    echo "📦 Pushing Backend Repository..."
    git add .
    git commit -m "Backend updates"
    git push origin main
    echo "✅ Backend pushed!"
else
    echo "⊘ Backend: No changes"
fi
echo ""

cd ../mindsphere-frontend
if [[ ! -z $(git status -s) ]]; then
    echo "📦 Pushing Frontend Repository..."
    git add .
    git commit -m "Frontend updates"
    git push origin main
    echo "✅ Frontend pushed!"
else
    echo "⊘ Frontend: No changes"
fi
echo ""

cd ../mindsphere-ai-agent
if [[ ! -z $(git status -s) ]]; then
    echo "📦 Pushing AI Agent Repository..."
    git add .
    git commit -m "AI Agent updates"
    git push origin main
    echo "✅ AI Agent pushed!"
else
    echo "⊘ AI Agent: No changes"
fi
echo ""

cd ../mindsphere-mobile
if [[ ! -z $(git status -s) ]]; then
    echo "📦 Pushing Mobile Repository..."
    git add .
    git commit -m "Mobile updates"
    git push origin main
    echo "✅ Mobile pushed!"
else
    echo "⊘ Mobile: No changes"
fi

cd ..
echo ""
echo "════════════════════════════════════════"
echo "✅ All repositories checked and pushed!"
echo "════════════════════════════════════════"

