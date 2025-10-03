#!/bin/bash

echo "🚀 Starting MindSphere Backend (Development)"
echo "============================================"

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo "✅ Environment variables loaded"
else
  echo "⚠️  Warning: .env file not found"
fi

# Start server
echo "📦 Starting Express server on port ${PORT:-8000}..."
node src/index.js
