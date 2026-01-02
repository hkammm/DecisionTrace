#!/bin/bash
# Quick Start Script for DecisionTrace Full-Stack App

echo "🚀 DecisionTrace Full-Stack Setup"
echo "=================================="

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js detected: $(node -v)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"
cd ..

# Create environment files
echo ""
echo "⚙️  Creating environment files..."

if [ ! -f ".env" ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo "✅ Created frontend .env"
else
    echo "⚠️  .env already exists, skipping"
fi

if [ ! -f "server/.env" ]; then
    cat > server/.env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/decisiontrace
JWT_SECRET=dev-secret-key-change-this-in-production
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
EOF
    echo "✅ Created backend .env"
else
    echo "⚠️  server/.env already exists, skipping"
fi

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo "=================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Start MongoDB (choose one):"
echo "   Option A: docker run -d -p 27017:27017 mongo:latest"
echo "   Option B: Create MongoDB Atlas account (free) at mongodb.com/cloud/atlas"
echo ""
echo "2. Update server/.env with:"
echo "   - MONGODB_URI (if using Atlas)"
echo "   - GEMINI_API_KEY (get from aistudio.google.com/app/apikey)"
echo ""
echo "3. Run the app (open 2 terminals):"
echo "   Terminal 1: npm run dev:server"
echo "   Terminal 2: npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "5. Register a new account and start using DecisionTrace!"
echo ""
echo "📚 For more info, see SETUP.md or FULL_STACK_README.md"
