#!/bin/sh

# Start the backend server in the background
cd /app/backend
node src/index.js &
BACKEND_PID=$!

# Start the voice agent in the background
cd /app
npx tsx voice-agent.ts start &
VOICE_PID=$!

# Function to handle shutdown
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $VOICE_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Wait for either process to exit
wait $BACKEND_PID $VOICE_PID
