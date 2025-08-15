#!/bin/bash

echo "🚀 Starting 2nd E-commerce System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check backend health
echo "🔍 Checking backend health..."
for i in {1..30}; do
    if curl -s http://localhost:5001/health > /dev/null; then
        echo "✅ Backend is running!"
        break
    fi
    echo "⏳ Waiting for backend... ($i/30)"
    sleep 2
done

# Check frontend
echo "🔍 Checking frontend..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Frontend is running!"
        break
    fi
    echo "⏳ Waiting for frontend... ($i/30)"
    sleep 2
done

echo ""
echo "🎉 System is ready!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
echo "📊 Health Check: http://localhost:5001/health"
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
