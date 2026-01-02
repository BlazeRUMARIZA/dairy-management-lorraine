#!/bin/bash

# Railway Backend Deployment Status Checker
# Run this script to get current deployment info

echo "════════════════════════════════════════════════════════"
echo "🚂 Railway Backend Deployment Status"
echo "════════════════════════════════════════════════════════"
echo ""

echo "📋 Latest Git Commits:"
git log --oneline -5
echo ""

echo "════════════════════════════════════════════════════════"
echo "📦 Root package.json scripts:"
echo "════════════════════════════════════════════════════════"
cat package.json | grep -A 8 '"scripts"'
echo ""

echo "════════════════════════════════════════════════════════"
echo "📦 Backend package.json scripts:"
echo "════════════════════════════════════════════════════════"
cat backend/package.json | grep -A 8 '"scripts"'
echo ""

echo "════════════════════════════════════════════════════════"
echo "✅ Backend Files Check:"
echo "════════════════════════════════════════════════════════"
echo "User Controller exists:"
ls -lh backend/src/controllers/userController.ts 2>/dev/null || echo "❌ Missing!"
echo ""
echo "User Routes exists:"
ls -lh backend/src/routes/userRoutes.ts 2>/dev/null || echo "❌ Missing!"
echo ""
echo "Compiled User Controller exists:"
ls -lh backend/dist/controllers/userController.js 2>/dev/null || echo "❌ Missing!"
echo ""
echo "Compiled User Routes exists:"
ls -lh backend/dist/routes/userRoutes.js 2>/dev/null || echo "❌ Missing!"
echo ""

echo "════════════════════════════════════════════════════════"
echo "🔍 Server.ts imports userRoutes:"
echo "════════════════════════════════════════════════════════"
grep -n "userRoutes" backend/src/server.ts
echo ""

echo "════════════════════════════════════════════════════════"
echo "🧪 Quick API Test (without auth):"
echo "════════════════════════════════════════════════════════"
echo "Testing: https://worthy-blessing-production.up.railway.app/health"
curl -s https://worthy-blessing-production.up.railway.app/health | head -5
echo ""
echo ""
echo "Testing: https://worthy-blessing-production.up.railway.app/api/v1/users"
echo "Response:"
curl -s https://worthy-blessing-production.up.railway.app/api/v1/users
echo ""
echo ""

echo "════════════════════════════════════════════════════════"
echo "💡 What to look for:"
echo "════════════════════════════════════════════════════════"
echo ""
echo "✅ GOOD - API says: \"Not authorized, no token\""
echo "   → This means route EXISTS, just needs auth"
echo ""
echo "❌ BAD - API says: \"Not Found - /api/v1/users\""
echo "   → This means route DOESN'T EXIST yet"
echo "   → Railway hasn't redeployed with new code"
echo ""
echo "════════════════════════════════════════════════════════"
echo "📝 Next Steps:"
echo "════════════════════════════════════════════════════════"
echo ""
echo "If you see 'Not Found' error:"
echo "1. Check Railway dashboard for deployment status"
echo "2. Look for latest commit: fdf626c"
echo "3. Check if deployment succeeded"
echo "4. If stuck, manually trigger redeploy in Railway"
echo ""
echo "If you see 'Not authorized' response:"
echo "🎉 SUCCESS! Backend is deployed. Test in frontend now!"
echo ""
