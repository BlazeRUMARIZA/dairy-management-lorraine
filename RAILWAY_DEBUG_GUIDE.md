# 🔧 Railway Deployment Debugging Guide

## Current Issue
**Error**: `Not Found - /api/v1/users` (404 Not Found)  
**Expected**: 200 OK with user list

The backend is running but the `/api/v1/users` route is not being recognized.

---

## What We Just Fixed

### 1. **Added railway.json Configuration** ✅
Created `/railway.json` to explicitly tell Railway:
- Where the backend code is (`backend/` subdirectory)
- How to build it (`cd backend && npm install && npm run build`)
- How to start it (`cd backend && npm start`)
- What files to watch for changes (`backend/**`)

### 2. **Updated server.ts with Comment** ✅
Added a timestamp comment to force Railway to detect the change:
```typescript
import userRoutes from './routes/userRoutes'; // User management CRUD routes - deployed 2026-01-02
```

### 3. **Pushed to GitHub** ✅
Commit: `04444cd` - "fix: Force Railway rebuild with railway.json config and updated comments"

---

## Railway Deployment Steps to Verify

### Step 1: Check Railway Dashboard
1. Go to https://railway.app
2. Select your project
3. Click on your backend service
4. Check the "Deployments" tab

**What to look for:**
- ✅ New deployment with commit `04444cd` should be building/deployed
- ✅ Status should show "Success" (green) after a few minutes
- ❌ If "Failed" (red), click to see logs

### Step 2: Check Build Logs
In Railway Dashboard → Deployments → Click on latest deployment → View Logs

**What to look for:**
```bash
# Should see these in build logs:
✓ Installing dependencies (npm install)
✓ Building TypeScript (npm run build)
✓ Compiling src/controllers/userController.ts
✓ Compiling src/routes/userRoutes.ts
✓ Build complete
```

### Step 3: Check Runtime Logs
In Railway Dashboard → Click "View Logs" button (top right)

**What to look for:**
```bash
# Should see these in runtime logs:
╔════════════════════════════════════════╗
║   🥛 Dairy Management System API      ║
║   Server running on port XXXX         ║
╚════════════════════════════════════════╝

✅ Database connected successfully
✅ CORS: Allowing origin: https://dairy-management-lorraine-production.up.railway.app
```

### Step 4: Verify Environment Variables
In Railway Dashboard → Variables tab

**Required variables:**
- ✅ `DATABASE_URL` - MySQL connection string
- ✅ `JWT_SECRET` - Your JWT secret key
- ✅ `NODE_ENV` - Should be "production"
- ✅ `API_VERSION` - Should be "v1"
- ✅ `PORT` - Automatically set by Railway

---

## Testing the Fix

### Method 1: Using Browser (Requires Login First)

1. **Login to get JWT token:**
   - Open your frontend: https://dairy-management-lorraine-production.up.railway.app
   - Login with admin credentials
   - Open browser DevTools (F12)
   - Go to "Network" tab
   - Click on any API request
   - Copy the "Authorization" header value (starts with "Bearer ...")

2. **Test the users endpoint:**
   - Open new browser tab
   - Open DevTools Console (F12)
   - Paste this code (replace YOUR_TOKEN with the token you copied):

   ```javascript
   fetch('https://worthy-blessing-production.up.railway.app/api/v1/users', {
     headers: {
       'Authorization': 'Bearer YOUR_TOKEN_HERE'
     }
   })
   .then(r => r.json())
   .then(data => console.log('✅ Success:', data))
   .catch(err => console.error('❌ Error:', err));
   ```

**Expected Result:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "email": "admin@example.com",
      "role": "admin",
      "name": "Admin User",
      ...
    }
  ]
}
```

### Method 2: Using curl (Command Line)

```bash
# First, get a token by logging in
curl -X POST https://worthy-blessing-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_admin_password"
  }'

# Copy the token from response, then test users endpoint
curl https://worthy-blessing-production.up.railway.app/api/v1/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Method 3: Using Postman

1. **Create a new request:**
   - Method: `GET`
   - URL: `https://worthy-blessing-production.up.railway.app/api/v1/users`

2. **Add Authorization:**
   - Click "Authorization" tab
   - Type: "Bearer Token"
   - Token: [Login first to get token from /api/v1/auth/login]

3. **Send Request**
   - Click "Send"
   - Should get 200 OK with user list

### Method 4: Test in Your Frontend
Once Railway finishes deploying:

1. Go to your frontend app in production
2. Login as admin
3. Navigate to **Settings** → **Users** tab
4. The user list should load (no more 500 error!)
5. Try editing a user → Should work ✅
6. Try deleting a user → Should work ✅

---

## Troubleshooting

### Issue 1: Still Getting 404 Not Found

**Possible Causes:**
1. Railway cached old deployment
2. railway.json not being picked up
3. Backend not in correct subdirectory

**Solutions:**
```bash
# Option A: Manual Redeploy in Railway Dashboard
1. Go to Railway Dashboard
2. Click on backend service
3. Click "Deployments" tab
4. Click "Redeploy" on latest deployment

# Option B: Force another commit
cd /home/rumariza/Documents/GitHub/dairy-management-lorraine
echo "# Force rebuild $(date)" >> backend/README.md
git add -A
git commit -m "chore: Force Railway rebuild"
git push origin main
```

### Issue 2: Build Fails on Railway

**Check:**
- Railway logs show TypeScript compilation errors?
- Solution: The build might fail but still create dist files. Check if Railway has a "nixpacks.toml" override

**Fix:**
Create `nixpacks.toml` in root:
```toml
[phases.build]
cmds = ["cd backend && npm ci && npm run build || true"]

[phases.start]
cmd = "cd backend && npm start"
```

### Issue 3: 500 Internal Server Error (Not 404)

**This means:**
- Route IS found ✅
- But controller/middleware has an error ❌

**Check:**
- Railway runtime logs for error details
- Database connection working? (Check DATABASE_URL)
- All dependencies installed?

### Issue 4: 403 Forbidden

**This means:**
- Route works ✅
- But user doesn't have permission ❌

**Fix:**
- Make sure you're logged in as admin
- Check JWT token is valid and not expired
- Verify user role in database is "admin"

---

## Expected Timeline

- **Now**: Code pushed to GitHub (commit `04444cd`)
- **+1-2 min**: Railway detects changes and starts build
- **+3-5 min**: Build completes, deployment starts
- **+5-7 min**: Deployment live, /api/v1/users should work

---

## Verification Checklist

Once you see Railway deployment success:

- [ ] Railway dashboard shows "Success" status
- [ ] Runtime logs show "Server running on port XXXX"
- [ ] Health check works: https://worthy-blessing-production.up.railway.app/health
- [ ] Users endpoint responds: https://worthy-blessing-production.up.railway.app/api/v1/users (with auth)
- [ ] Frontend Settings page loads users
- [ ] Can edit user in Settings
- [ ] Can delete user in Settings
- [ ] Changes persist after page refresh

---

## Quick Status Check Commands

Run these to check if fix is working:

```bash
# 1. Check if server is up
curl https://worthy-blessing-production.up.railway.app/health

# 2. Check if users route exists (will get 401 without auth, but NOT 404)
curl https://worthy-blessing-production.up.railway.app/api/v1/users

# Expected responses:
# ✅ If route exists: {"success":false,"message":"Not authorized, no token"}
# ❌ If route missing: {"success":false,"message":"Not Found - /api/v1/users"}
```

---

## If All Else Fails

### Nuclear Option: Fresh Railway Deployment

1. **Create new Railway service:**
   - Railway Dashboard → New → Deploy from GitHub
   - Select your repository
   - Set root directory to `backend`
   - Add environment variables

2. **Or use Railway CLI:**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Link project
   cd /home/rumariza/Documents/GitHub/dairy-management-lorraine/backend
   railway link
   
   # Deploy
   railway up
   ```

---

## Success Indicators

You'll know it's working when:

1. ✅ Railway logs show no errors
2. ✅ `curl https://worthy-blessing-production.up.railway.app/api/v1/users` returns 401 (not 404)
3. ✅ Settings page in frontend loads users
4. ✅ Can update user info and see changes persist
5. ✅ Can delete users

---

## Current Status

- **Last Deploy**: Commit `04444cd` (January 2, 2026)
- **Changes**: Added railway.json + server.ts comment
- **Expected Fix**: Railway will now correctly find and build backend subdirectory
- **Wait Time**: ~5 minutes for Railway to rebuild and deploy

**Next Step**: Check Railway dashboard for deployment status!
