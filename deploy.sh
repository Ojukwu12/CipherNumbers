#!/bin/bash
# Render Deploy Script
# Deploy both frontend and backend to Render

echo "🚀 Deploying CipherNumbers to Render..."

# Backend
echo "📡 Deploying backend..."
cd backend
git push render main
cd ..

# Frontend
echo "🎨 Deploying frontend..."
cd frontend
git push render main
cd ..

echo "✅ Deployment initiated!"
echo "Check https://dashboard.render.com for deployment status"
