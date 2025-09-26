#!/bin/bash

# Start MindSphere backend in development mode
# This script sets the correct environment variables for local development

echo "🚀 Starting MindSphere backend in development mode..."

# Set environment variables for development
export NODE_ENV=development
export SUPABASE_AUTH_ENABLED=false

# Start the backend server
cd backend && node src/index.js
