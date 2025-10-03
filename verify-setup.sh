#!/bin/bash

echo "🔍 VERIFYING MINDSPHERE SEPARATION"
echo "=================================="
echo ""

# Check directories
echo "📁 Checking repositories..."
for repo in mindsphere-frontend mindsphere-backend mindsphere-ai-agent mindsphere-mobile; do
  if [ -d "$repo" ]; then
    echo "  ✅ $repo exists"
  else
    echo "  ❌ $repo missing"
  fi
done
echo ""

# Check dependencies
echo "📦 Checking dependencies..."
for repo in mindsphere-frontend mindsphere-backend mindsphere-ai-agent; do
  if [ -d "$repo/node_modules" ]; then
    echo "  ✅ $repo/node_modules installed"
  else
    echo "  ⚠️  $repo/node_modules missing (run: cd $repo && npm install)"
  fi
done
echo ""

# Check package.json
echo "📄 Checking package.json files..."
for repo in mindsphere-frontend mindsphere-backend mindsphere-ai-agent mindsphere-mobile; do
  if [ -f "$repo/package.json" ]; then
    echo "  ✅ $repo/package.json exists"
  else
    echo "  ❌ $repo/package.json missing"
  fi
done
echo ""

# Check env examples
echo "🔐 Checking environment templates..."
for repo in mindsphere-frontend mindsphere-backend mindsphere-ai-agent; do
  if [ -f "$repo/env.example" ] || [ -f "$repo/.env.example" ]; then
    echo "  ✅ $repo has env.example"
  else
    echo "  ⚠️  $repo missing env.example"
  fi
done
echo ""

# Check READMEs
echo "📚 Checking documentation..."
for repo in mindsphere-frontend mindsphere-backend mindsphere-ai-agent mindsphere-mobile; do
  if [ -f "$repo/README.md" ]; then
    echo "  ✅ $repo/README.md exists"
  else
    echo "  ⚠️  $repo/README.md missing"
  fi
done
echo ""

echo "✅ Verification complete!"
