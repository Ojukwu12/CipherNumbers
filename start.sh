#!/bin/bash

# CipherNumbers - Start All Services
# Runs backend and frontend concurrently

echo "🚀 Starting CipherNumbers..."
echo ""

# Start backend in background
echo "📡 Starting Backend on port 3001..."
cd backend
npm run dev &
BACKEND_PID=$!

# Start frontend in background
echo "🎨 Starting Frontend on port 3000..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both services are running!"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
