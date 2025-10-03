#!/bin/bash

echo "🚀 Starting All MindSphere Services"
echo "===================================="
echo ""

# Function to check if port is available
check_port() {
  if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Port $1 is already in use"
    return 1
  else
    echo "✅ Port $1 is available"
    return 0
  fi
}

# Check ports
echo "🔍 Checking port availability..."
check_port 8000 || exit 1
check_port 5173 || exit 1
echo ""

# Start backend
echo "1️⃣  Starting Backend (Port 8000)..."
cd mindsphere-backend
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
cd ..

# Wait for backend
sleep 3

# Start frontend
echo "2️⃣  Starting Frontend (Port 5173)..."
cd mindsphere-frontend  
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
cd ..

# Wait for services to start
sleep 3

echo ""
echo "✅ All services started!"
echo "========================"
echo "🌐 Frontend:  http://localhost:5173"
echo "🔧 Backend:   http://localhost:8000"
echo "📊 Health:    http://localhost:8000/health"
echo ""
echo "📝 Logs:"
echo "   Backend:  logs/backend.log"
echo "   Frontend: logs/frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "echo '' && echo '🛑 Stopping services...' && kill $BACKEND_PID $FRONTEND_PID 2>/dev/null && echo '✅ All services stopped' && exit 0" INT
wait
