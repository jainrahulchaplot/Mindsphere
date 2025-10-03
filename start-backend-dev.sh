#!/bin/bash

# Start MindSphere backend in development mode
# This script sets the correct environment variables for local development

echo "🚀 Starting MindSphere backend in development mode..."

# Set environment variables for development
export NODE_ENV=development
export SUPABASE_AUTH_ENABLED=false
export CORS_ALLOWED_ORIGINS="http://localhost:5173,http://localhost:5174,https://mindsphere-theta.vercel.app"

echo "🌍 CORS Origins: $CORS_ALLOWED_ORIGINS"

# Start the backend server
cd backend && node src/index.js
