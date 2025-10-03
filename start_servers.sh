#!/bin/bash

# MindSphere Application Startup Script
# This script starts both the backend and frontend servers

echo "🚀 Starting MindSphere Application..."
echo "=================================="

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Check if ports are available
echo "🔍 Checking port availability..."
check_port 8000
check_port 5173

echo ""
echo "📦 Starting Backend Server (Port 8000)..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo "📦 Starting Frontend Server (Port 5173)..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started successfully!"
echo "=================================="
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8000"
echo "📊 Health:   http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
