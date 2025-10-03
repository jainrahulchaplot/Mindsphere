#!/bin/bash
# Quick start script - starts both servers in background
echo "🚀 Starting MindSphere servers..."
cd backend && npm run dev & cd .. && npm run dev &
echo "✅ Servers started! Frontend: http://localhost:5173, Backend: http://localhost:8000"
