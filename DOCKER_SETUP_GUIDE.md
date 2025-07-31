# 🐳 Dumee Docker Configuration & Usage Guide

## ✅ **DOCKER FILES VERIFIED**

All Docker configurations have been verified and properly configured for Dumee:

### **📁 Docker Files Present:**
1. ✅ **Dockerfile** - Production multi-stage build
2. ✅ **Dockerfile.multi** - Alternative name (identical content)
3. ✅ **docker-compose.yml** - Standard Docker Compose
4. ✅ **docker-compose.dev.yml** - Development with hot-reload
5. ✅ **deploy-compose.yml** - Production deployment
6. ✅ **docker.env.template** - Environment template
7. ✅ **.dockerignore** - Build exclusions

---

## 🚀 **HOW TO RUN DUMEE**

### **⚠️ IMPORTANT: Always run from the correct directory!**

```bash
cd C:\Users\amora\Desktop\Dumee\DumeeApp
```

### **Option 1: Local Development (Without Docker)**

```bash
# Terminal 1 - Frontend (Port 3090):
cd C:\Users\amora\Desktop\Dumee\DumeeApp
npm run frontend:dev

# Terminal 2 - Backend API (Port 3080):
cd C:\Users\amora\Desktop\Dumee\DumeeApp\api
npm run dev
```

### **Option 2: Docker Development (Recommended)**

```bash
# Make sure Docker Desktop is running first!

# Navigate to DumeeApp:
cd C:\Users\amora\Desktop\Dumee\DumeeApp

# Run with Docker Compose:
docker-compose -f docker-compose.dev.yml up

# Or for production mode:
docker-compose up
```

---

## 🔧 **DOCKER CONFIGURATION DETAILS**

### **✅ Verified Dumee Branding in Docker:**

1. **Container Names:**
   - `Dumee` (main API)
   - `dumee-dev-api`
   - `dumee-dev-frontend`
   - `Dumee-API` (production)
   - `Dumee-NGINX` (production)

2. **Database Configuration:**
   - MongoDB: `mongodb://mongodb:27017/Dumee` ✅
   - All references updated to Dumee

3. **Images:**
   - `ghcr.io/your-username/dumee-dev:latest`
   - `ghcr.io/your-username/dumee-rag-api-dev:latest`

---

## 🛠️ **BUILDING DOCKER IMAGES**

### **Build for Development:**
```bash
cd C:\Users\amora\Desktop\Dumee\DumeeApp
docker build -t dumee:dev .
```

### **Build for Production:**
```bash
cd C:\Users\amora\Desktop\Dumee\DumeeApp
docker build -t dumee:prod --target production .
```

### **Using Docker Compose Build:**
```bash
# Development build
docker-compose -f docker-compose.dev.yml build

# Production build
docker-compose build
```

---

## 📋 **ENVIRONMENT SETUP**

1. **Copy environment template:**
   ```bash
   cp docker.env.template .env
   ```

2. **Update `.env` with your values:**
   - API keys (OpenAI, Anthropic, etc.)
   - Database credentials
   - Security secrets

---

## 🎯 **QUICK START COMMANDS**

### **For immediate testing:**

```bash
# 1. Go to correct directory:
cd C:\Users\amora\Desktop\Dumee\DumeeApp

# 2. Start frontend:
npm run frontend:dev

# 3. In new terminal, start backend:
cd C:\Users\amora\Desktop\Dumee\DumeeApp\api
npm run dev

# 4. Access:
# Frontend: http://localhost:3090
# API: http://localhost:3080
```

### **For Docker (after Docker Desktop is running):**

```bash
# 1. Go to correct directory:
cd C:\Users\amora\Desktop\Dumee\DumeeApp

# 2. Start all services:
docker-compose -f docker-compose.dev.yml up

# 3. Access:
# Frontend: http://localhost:3090
# API: http://localhost:3080
```

---

## ✅ **STATUS: DOCKER CONFIGURATION VERIFIED**

- ✅ All Docker files properly configured for Dumee
- ✅ No LibreChat references in Docker configurations
- ✅ Correct container names and branding
- ✅ Proper directory structure maintained
- ✅ Development and production configurations ready

**Your Dumee Docker setup is ready for deployment!** 🚀