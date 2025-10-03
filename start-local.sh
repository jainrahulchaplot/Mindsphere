#!/bin/bash

# MindSphere Local Development Startup Script
# This script starts all services for local development

set -e

echo "🚀 MindSphere Local Development Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="/Users/rahul/Documents/Mindsphere V1 Separated"

# Check if .env files exist
check_env_files() {
    echo "🔍 Checking environment files..."
    
    if [ ! -f "$BASE_DIR/mindsphere-backend/.env" ]; then
        echo -e "${RED}❌ Backend .env not found!${NC}"
        echo "   Copy from: $BASE_DIR/mindsphere-backend/env.example"
        return 1
    else
        echo -e "${GREEN}✅ Backend .env found${NC}"
    fi
    
    if [ ! -f "$BASE_DIR/mindsphere-frontend/.env" ]; then
        echo -e "${RED}❌ Frontend .env not found!${NC}"
        echo "   Copy from: $BASE_DIR/mindsphere-frontend/env.example"
        return 1
    else
        echo -e "${GREEN}✅ Frontend .env found${NC}"
    fi
    
    return 0
}

# Check if node_modules exist
check_dependencies() {
    echo ""
    echo "📦 Checking dependencies..."
    
    if [ ! -d "$BASE_DIR/mindsphere-backend/node_modules" ]; then
        echo -e "${YELLOW}⚠️  Backend dependencies not installed${NC}"
        echo "   Installing backend dependencies..."
        cd "$BASE_DIR/mindsphere-backend"
        npm install
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo -e "${GREEN}✅ Backend dependencies found${NC}"
    fi
    
    if [ ! -d "$BASE_DIR/mindsphere-frontend/node_modules" ]; then
        echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
        echo "   Installing frontend dependencies..."
        cd "$BASE_DIR/mindsphere-frontend"
        npm install
        echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    else
        echo -e "${GREEN}✅ Frontend dependencies found${NC}"
    fi
}

# Start services
start_services() {
    echo ""
    echo "🚀 Starting services..."
    echo ""
    
    # Start Backend
    echo "📦 Starting Backend on http://localhost:8000..."
    cd "$BASE_DIR/mindsphere-backend"
    npm start > "$BASE_DIR/logs/backend.log" 2>&1 &
    BACKEND_PID=$!
    echo "   Backend PID: $BACKEND_PID"
    
    # Wait for backend to start
    echo "   Waiting for backend to start..."
    sleep 5
    
    # Check if backend is running
    if curl -s http://localhost:8000/health > /dev/null; then
        echo -e "${GREEN}✅ Backend started successfully${NC}"
    else
        echo -e "${RED}❌ Backend failed to start${NC}"
        echo "   Check logs at: $BASE_DIR/logs/backend.log"
    fi
    
    # Start Frontend
    echo ""
    echo "🎨 Starting Frontend on http://localhost:5173..."
    cd "$BASE_DIR/mindsphere-frontend"
    npm run dev > "$BASE_DIR/logs/frontend.log" 2>&1 &
    FRONTEND_PID=$!
    echo "   Frontend PID: $FRONTEND_PID"
    
    # Wait for frontend to start
    echo "   Waiting for frontend to start..."
    sleep 5
    
    # Check if frontend is running
    if curl -s http://localhost:5173 > /dev/null; then
        echo -e "${GREEN}✅ Frontend started successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend may still be starting...${NC}"
    fi
    
    # Save PIDs for cleanup
    echo "$BACKEND_PID" > "$BASE_DIR/.backend.pid"
    echo "$FRONTEND_PID" > "$BASE_DIR/.frontend.pid"
}

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    
    if [ -f "$BASE_DIR/.backend.pid" ]; then
        BACKEND_PID=$(cat "$BASE_DIR/.backend.pid")
        kill $BACKEND_PID 2>/dev/null || true
        rm "$BASE_DIR/.backend.pid"
        echo "✅ Backend stopped"
    fi
    
    if [ -f "$BASE_DIR/.frontend.pid" ]; then
        FRONTEND_PID=$(cat "$BASE_DIR/.frontend.pid")
        kill $FRONTEND_PID 2>/dev/null || true
        rm "$BASE_DIR/.frontend.pid"
        echo "✅ Frontend stopped"
    fi
    
    echo "👋 Goodbye!"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    # Create logs directory
    mkdir -p "$BASE_DIR/logs"
    
    # Check prerequisites
    if ! check_env_files; then
        echo ""
        echo -e "${RED}❌ Setup incomplete. Please create .env files first.${NC}"
        echo ""
        echo "Quick setup:"
        echo "  cd '$BASE_DIR/mindsphere-backend' && cp env.example .env"
        echo "  cd '$BASE_DIR/mindsphere-frontend' && cp env.example .env"
        echo ""
        echo "Then edit both .env files with your credentials."
        exit 1
    fi
    
    check_dependencies
    start_services
    
    echo ""
    echo "======================================"
    echo -e "${GREEN}✅ MindSphere is running!${NC}"
    echo "======================================"
    echo ""
    echo "📍 Services:"
    echo "   Backend:  http://localhost:8000"
    echo "   Frontend: http://localhost:5173"
    echo ""
    echo "📝 Logs:"
    echo "   Backend:  $BASE_DIR/logs/backend.log"
    echo "   Frontend: $BASE_DIR/logs/frontend.log"
    echo ""
    echo "🔍 Health Check:"
    echo "   curl http://localhost:8000/health"
    echo ""
    echo "🛑 Press Ctrl+C to stop all services"
    echo ""
    
    # Keep script running
    wait
}

# Run main
main

