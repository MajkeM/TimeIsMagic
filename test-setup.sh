#!/bin/bash

echo "🚀 Time Is Magic - Database Setup Test"
echo "======================================"

# Zkontroluj zda existuje .env.local
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your database credentials"
    exit 1
fi

# Zkontroluj zda jsou nastavené databázové proměnné
if grep -q "VLOŽTE_VÁŠ_POSTGRES_URL" .env.local; then
    echo "❌ Please update .env.local with your actual database credentials"
    echo "Replace all 'VLOŽTE_VÁŠ_...' placeholders with real values from Vercel"
    exit 1
fi

echo "✅ .env.local file exists and seems configured"

# Spusť aplikaci na pozadí
echo "🔄 Starting development server..."
npm run dev > /dev/null 2>&1 &
DEV_PID=$!

# Počkej než se server spustí
sleep 5

echo "⏳ Waiting for server to start..."
sleep 3

# Test zda server běží
if curl -s http://localhost:1111 > /dev/null; then
    echo "✅ Server is running on http://localhost:1111"
else
    echo "❌ Server failed to start"
    kill $DEV_PID 2>/dev/null
    exit 1
fi

# Inicializuj databázi
echo "🗄️  Initializing database..."
INIT_RESPONSE=$(curl -s -X POST http://localhost:1111/api/init)

if echo "$INIT_RESPONSE" | grep -q "successfully"; then
    echo "✅ Database initialized successfully"
else
    echo "❌ Database initialization failed:"
    echo "$INIT_RESPONSE"
fi

echo ""
echo "🎉 Setup complete!"
echo "======================================"
echo "📱 Open your browser and go to:"
echo "   http://localhost:1111"
echo ""
echo "🔑 You should see a login/register form"
echo "1. Register a new account"
echo "2. Login with your credentials"  
echo "3. Your progress will be saved to database!"
echo ""
echo "⚠️  To stop the server, press Ctrl+C"
echo "    Or run: kill $DEV_PID"

# Drž server spuštěný
wait $DEV_PID