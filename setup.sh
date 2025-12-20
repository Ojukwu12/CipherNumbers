#!/bin/bash

# CipherNumbers - Local Development Setup
# Quick start script for development

set -e

echo "╔════════════════════════════════════════╗"
echo "║     CipherNumbers - Setup Script       ║"
echo "║     FHE Encrypted Computation Demo     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📡 Setting up Backend..."
cd backend
npm install
cp .env.example .env
echo "✅ Backend ready at http://localhost:3001"
echo ""

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd ../frontend
npm install
cp .env.example .env
echo "✅ Frontend ready at http://localhost:3000"
echo ""

# Setup Contracts (optional)
echo "📜 Setting up Smart Contracts..."
cd ../contracts
npm install
echo "✅ Contracts ready for deployment"
echo ""

echo "╔════════════════════════════════════════╗"
echo "║     Setup Complete!                   ║"
echo "╠════════════════════════════════════════╣"
echo "║ To start development:                  ║"
echo "║                                        ║"
echo "║ Terminal 1 (Backend):                  ║"
echo "║   cd backend && npm run dev            ║"
echo "║                                        ║"
echo "║ Terminal 2 (Frontend):                 ║"
echo "║   cd frontend && npm run dev           ║"
echo "║                                        ║"
echo "║ Then open: http://localhost:3000       ║"
echo "╚════════════════════════════════════════╝"
