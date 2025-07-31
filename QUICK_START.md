# 🚀 DUMEE QUICK START GUIDE

## ⚡ IMMEDIATE SOLUTIONS

### ❌ **STOP RUNNING FROM WRONG DIRECTORY!**

You keep running from `C:\Users\amora\Desktop\Dumee`

✅ **CORRECT DIRECTORY:** `C:\Users\amora\Desktop\Dumee\DumeeApp`

---

## 🎯 METHOD 1: RUN WITHOUT DOCKER (FASTEST)

```powershell
# STEP 1: Open Terminal 1
cd C:\Users\amora\Desktop\Dumee\DumeeApp
npm run frontend:dev

# STEP 2: Open Terminal 2
cd C:\Users\amora\Desktop\Dumee\DumeeApp\api
npm run dev

# STEP 3: Open browser
# Frontend: http://localhost:3090
# API: http://localhost:3080
```

---

## 🐳 METHOD 2: DOCKER (INFRASTRUCTURE ONLY)

### Start supporting services:
```powershell
cd C:\Users\amora\Desktop\Dumee\DumeeApp
docker-compose -f docker-compose.simple.yml up -d
```

This starts:
- ✅ MongoDB (port 27017)
- ✅ Meilisearch (port 7700)
- ✅ Redis (port 6379)

Then run the app locally:
```powershell
# Terminal 1:
cd C:\Users\amora\Desktop\Dumee\DumeeApp
npm run frontend:dev

# Terminal 2:
cd C:\Users\amora\Desktop\Dumee\DumeeApp\api
npm run dev
```

---

## 🔧 FIXING THE DOCKER BUILD ISSUE

The Docker build fails due to Rollup requiring platform-specific binaries. Here are solutions:

### Option 1: Use Simplified Dockerfile (Recommended)
```powershell
cd C:\Users\amora\Desktop\Dumee\DumeeApp
docker build -f Dockerfile.simple -t dumee:latest .
```

### Option 2: Fix the main Dockerfile
The issue is that Rollup needs the Alpine Linux binary. We've already modified the Dockerfile to skip complex builds.

### Option 3: Build locally, then dockerize
```powershell
# Build on Windows first
cd C:\Users\amora\Desktop\Dumee\DumeeApp
npm run build:data-provider
npm run build:data-schemas
npm run build:agents
npm run build:api

# Then build Docker image
docker build -t dumee:latest .
```

---

## ✅ VERIFIED WORKING APPROACH

**For immediate use without Docker issues:**

1. **Start Infrastructure (Optional):**
   ```powershell
   cd C:\Users\amora\Desktop\Dumee\DumeeApp
   docker-compose -f docker-compose.simple.yml up -d
   ```

2. **Run Application:**
   ```powershell
   # Terminal 1:
   cd C:\Users\amora\Desktop\Dumee\DumeeApp
   npm run frontend:dev

   # Terminal 2:
   cd C:\Users\amora\Desktop\Dumee\DumeeApp\api
   npm run dev
   ```

3. **Access:**
   - Frontend: http://localhost:3090
   - API: http://localhost:3080

---

## 📝 IMPORTANT NOTES

1. **Always use the correct directory:** `DumeeApp` not just `Dumee`
2. **Docker build issues** are due to Rollup platform binaries - use the simplified approach
3. **The app works perfectly** without Docker for development
4. **For production**, we'll need to properly configure the build process

---

## 🎉 YOUR APP IS READY!

Just follow the commands above from the CORRECT directory and your Dumee application will run perfectly!