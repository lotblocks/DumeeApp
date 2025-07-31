# Dumee SAAS Platform - System Requirements

## 📋 **System Requirements**

### **Minimum Requirements**
- **Node.js**: 18.17.0 or higher
- **npm**: 9.0.0 or higher (or bun 1.0.0+)
- **MongoDB**: 5.0 or higher
- **Redis**: 6.0 or higher
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 20GB minimum for development

### **Production Requirements**
- **Node.js**: 20.x LTS (recommended)
- **RAM**: 16GB minimum, 32GB+ recommended
- **CPU**: 4 cores minimum, 8+ cores recommended
- **Storage**: 100GB+ SSD for production
- **Network**: Stable internet connection for AI API calls

---

## 🔧 **Core Dependencies**

### **Runtime Environment**
- Node.js 18.17.0+
- npm 9.0.0+ or bun 1.0.0+
- MongoDB 5.0+
- Redis 6.0+
- Meilisearch 1.12.3+

### **Container Requirements**
- Docker 24.0+
- Docker Compose 2.20+
- Kubernetes 1.28+ (for production)

---

## 📦 **Installation Guide**

### **1. Install Node.js Dependencies**
```bash
# In the root directory
npm install

# Or using bun
bun install
```

### **2. Install Package Dependencies**
```bash
# Install workspace dependencies
npm run reinstall

# Or for Docker deployment
npm run reinstall:docker
```

### **3. Database Setup**
```bash
# MongoDB (via Docker)
docker run -d --name dumee-mongodb \
  -p 27017:27017 \
  mongo:5.0

# Redis (via Docker)  
docker run -d --name dumee-redis \
  -p 6379:6379 \
  redis:6-alpine

# Meilisearch (via Docker)
docker run -d --name dumee-meilisearch \
  -p 7700:7700 \
  getmeili/meilisearch:v1.12.3
```

### **4. Environment Configuration**
```bash
# Copy example environment file
cp .env.example .env

# Configure your environment variables
# See Environment Variables section below
```

---

## 🌍 **Environment Variables**

### **Required Variables**
```bash
# Application
NODE_ENV=production
PORT=3080
HOST=0.0.0.0

# Database
MONGO_URI=mongodb://localhost:27017/Dumee
REDIS_URI=redis://localhost:6379

# Search
MEILI_HOST=http://localhost:7700
MEILI_MASTER_KEY=your_secure_key_here

# Security
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CREDS_KEY=your_32_char_hex_key_here
CREDS_IV=your_16_char_hex_iv_here

# AI Providers (at least one required)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
AZURE_OPENAI_API_KEY=your_azure_key
```

### **Optional Variables**
```bash
# File Storage
FILE_STRATEGY=local  # local, s3, firebase, azure
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name

# Email Service
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_password

# Analytics
ANALYTICS_GTM_ID=GTM-XXXXXXX

# Rate Limiting
LIMIT_CONCURRENT_MESSAGES=true
LIMIT_MESSAGE_IP=40
LIMIT_MESSAGE_USER=40
```

---

## 🚀 **Deployment Options**

### **Development**
```bash
# Start all services
npm run dev

# Or using Docker
docker-compose up -d
```

### **Production**
```bash
# Using Docker
docker-compose -f deploy-compose.yml up -d

# Using Kubernetes
helm install dumee ./helm/dumee
```

---

## 🔍 **Health Checks**

### **Application Health**
- **Health endpoint**: `GET /health`
- **API status**: `GET /api/health`

### **Service Dependencies**
- **MongoDB**: Connection test on startup
- **Redis**: Connection test on startup  
- **Meilisearch**: Index health check
- **AI Providers**: API key validation

---

## 🛠 **Development Tools**

### **Required for Development**
```bash
# Install development dependencies
npm install --include=dev

# Install global tools
npm install -g nodemon
npm install -g typescript
npm install -g @playwright/test
```

### **Code Quality Tools**
- **ESLint**: Linting and code style
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript**: Type checking

### **Testing Tools**
- **Jest**: Unit testing
- **Playwright**: E2E testing
- **Supertest**: API testing

---

## 📊 **Monitoring & Observability**

### **Logging**
- **Winston**: Application logging
- **Morgan**: HTTP request logging
- **Structured logging**: JSON format for production

### **Metrics**
- **Health checks**: Built-in endpoint monitoring
- **Performance metrics**: Response time tracking
- **Error tracking**: Comprehensive error logging

### **Monitoring Integration**
- **Prometheus**: Metrics collection
- **Grafana**: Dashboard visualization
- **Alert Manager**: Alert notifications

---

## 🔒 **Security Requirements**

### **Authentication**
- JWT token-based authentication
- Refresh token rotation
- Session management with Redis

### **Encryption**
- Data encryption at rest
- TLS/SSL for data in transit
- API key encryption in database

### **Rate Limiting**
- Per-user message limits
- IP-based rate limiting
- Concurrent connection limits

---

## 📚 **Additional Resources**

- **API Documentation**: Available at `/api/docs` when running
- **Configuration Guide**: See `dumee.example.yaml`
- **Troubleshooting**: Check logs in `/logs` directory
- **Support**: contact support@dum.ee

---

*Last updated: 2025-01-XX*
*For the latest requirements, visit: https://dum.ee/docs/requirements*