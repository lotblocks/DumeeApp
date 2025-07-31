# 📚 Dumee SAAS Platform API Documentation

## 🚀 **Overview**

Dumee provides a comprehensive RESTful API for integrating AI chat capabilities into your applications. Our SAAS platform offers subscription-based access with different tiers and usage limits.

**Base URL**: `https://api.dum.ee`  
**Version**: v1  
**Format**: JSON  
**Authentication**: JWT Tokens  

---

## 🔐 **Authentication**

### **API Key Authentication**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.dum.ee/api/messages
```

### **JWT Token Authentication**
```bash
# 1. Login to get tokens
curl -X POST https://api.dum.ee/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# 2. Use access token
curl -H "Authorization: Bearer ACCESS_TOKEN" \
     https://api.dum.ee/api/user/profile
```

---

## 📊 **Rate Limits & Usage**

### **Subscription Tiers**
| Tier | Monthly Messages | API Calls | Price |
|------|------------------|-----------|-------|
| Free | 100 | 50 | $0 |
| Pro | 1,000 | 500 | $29 |
| Enterprise | 10,000 | 5,000 | Custom |

### **Rate Limit Headers**
```
X-Usage-Count: 45
X-Usage-Limit: 100
X-Usage-Remaining: 55
X-Subscription-Tier: free
X-Usage-Warning: Approaching monthly limit
```

---

## 🔗 **Core Endpoints**

### **Chat & Messages**

#### **Send Message**
```http
POST /api/messages
Content-Type: application/json
Authorization: Bearer TOKEN

{
  "text": "Hello, explain quantum computing",
  "parentMessageId": null,
  "conversationId": "conv_123",
  "model": "gpt-4",
  "endpoint": "openai"
}
```

**Response:**
```json
{
  "message": {
    "messageId": "msg_456",
    "conversationId": "conv_123",
    "text": "Quantum computing is...",
    "role": "assistant",
    "timestamp": "2025-01-20T10:30:00Z"
  },
  "conversation": {
    "conversationId": "conv_123",
    "title": "Quantum Computing Discussion"
  }
}
```

#### **Get Conversations**
```http
GET /api/convos
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "conversations": [
    {
      "conversationId": "conv_123",
      "title": "Quantum Computing Discussion",
      "createdAt": "2025-01-20T10:00:00Z",
      "updatedAt": "2025-01-20T10:30:00Z",
      "messageCount": 4
    }
  ],
  "pageNumber": 1,
  "totalPages": 1
}
```

### **File Management**

#### **Upload File**
```http
POST /api/files/upload
Authorization: Bearer TOKEN
Content-Type: multipart/form-data

file: [FILE_CONTENT]
endpoint: "openai"
```

**Response:**
```json
{
  "message": "File uploaded successfully",
  "file": {
    "file_id": "file_789",
    "filename": "document.pdf",
    "type": "application/pdf",
    "size": 1024576,
    "uploadedAt": "2025-01-20T10:30:00Z"
  }
}
```

#### **List Files**
```http
GET /api/files
Authorization: Bearer TOKEN
```

### **User Management**

#### **Get User Profile**
```http
GET /api/user/profile
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "subscription": {
      "tier": "pro",
      "status": "active",
      "currentPeriodEnd": "2025-02-20T00:00:00Z"
    },
    "usage": {
      "currentMonth": 245,
      "limit": 1000,
      "remaining": 755
    }
  }
}
```

#### **Update User Profile**
```http
PUT /api/user/profile
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "John Smith",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}
```

---

## 💳 **Subscription Management**

### **Get Subscription Tiers**
```http
GET /api/subscription/tiers
```

**Response:**
```json
{
  "tiers": {
    "free": {
      "name": "Free",
      "price": 0,
      "messageLimit": 100,
      "features": ["Basic AI models", "Web access"]
    },
    "pro": {
      "name": "Professional", 
      "price": 29,
      "messageLimit": 1000,
      "features": ["Advanced AI models", "API access"]
    }
  }
}
```

### **Get Subscription Status**
```http
GET /api/subscription/status
Authorization: Bearer TOKEN
```

### **Create Checkout Session**
```http
POST /api/subscription/create-checkout
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "tier": "pro"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/pay/cs_123",
  "sessionId": "cs_123",
  "tier": "pro",
  "price": 29
}
```

### **Cancel Subscription**
```http
POST /api/subscription/cancel
Authorization: Bearer TOKEN
```

### **Get Usage Analytics**
```http
GET /api/subscription/usage
Authorization: Bearer TOKEN
```

**Response:**
```json
{
  "current": {
    "period": "2025-01",
    "messages": 245,
    "apiCalls": 67,
    "storage": "5.2 MB"
  },
  "limits": {
    "messages": 1000,
    "apiCalls": 500,
    "storage": "1 GB"
  },
  "history": [
    {"period": "2024-12", "messages": 856, "apiCalls": 234}
  ]
}
```

---

## 🛠 **Configuration & Admin**

### **Get Available Models**
```http
GET /api/models
Authorization: Bearer TOKEN
```

### **Get Endpoints Configuration**  
```http
GET /api/endpoints
Authorization: Bearer TOKEN
```

### **Health Check**
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected", 
    "search": "connected"
  }
}
```

---

## 🔍 **Search & Tools**

### **Search Conversations**
```http
GET /api/search?q=quantum&type=messages
Authorization: Bearer TOKEN
```

### **Available Tools**
```http
GET /api/tools
Authorization: Bearer TOKEN
```

---

## 📝 **Error Handling**

### **Error Response Format**
```json
{
  "error": {
    "type": "usage_limit_exceeded",
    "message": "Monthly message limit (100) exceeded",
    "code": 429,
    "details": {
      "currentUsage": 100,
      "limit": 100,
      "subscriptionTier": "free",
      "upgradeUrl": "https://dum.ee/pricing"
    }
  }
}
```

### **Common Error Codes**
| Code | Type | Description |
|------|------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 429 | Rate Limited | Usage limit exceeded |
| 500 | Server Error | Internal server error |

---

## 📱 **SDKs & Libraries**

### **JavaScript/Node.js**
```bash
npm install dumee-sdk
```

```javascript
import DumeeAPI from 'dumee-sdk';

const dumee = new DumeeAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.dum.ee'
});

const response = await dumee.messages.create({
  text: 'Hello, explain AI to me',
  model: 'gpt-4'
});
```

### **Python**
```bash
pip install dumee-python
```

```python
from dumee import DumeeAPI

client = DumeeAPI(api_key="your-api-key")

response = client.messages.create(
    text="Hello, explain AI to me",
    model="gpt-4"
)
```

### **cURL Examples**
```bash
# Send a message
curl -X POST https://api.dum.ee/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello AI","model":"gpt-4"}'

# Get subscription status  
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.dum.ee/api/subscription/status

# Upload file
curl -X POST https://api.dum.ee/api/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

---

## 🔧 **Webhooks**

### **Subscription Events**
Configure webhooks to receive real-time updates:

```http
POST https://your-endpoint.com/webhooks/dumee
Content-Type: application/json
X-Dumee-Signature: sha256=...

{
  "event": "subscription.updated",
  "data": {
    "userId": "user_123",
    "subscription": {
      "tier": "pro",
      "status": "active"
    }
  },
  "timestamp": "2025-01-20T10:30:00Z"
}
```

**Supported Events:**
- `subscription.created`
- `subscription.updated` 
- `subscription.cancelled`
- `usage.limit_reached`
- `payment.succeeded`
- `payment.failed`

---

## 🚀 **Getting Started**

### **1. Sign Up**
Create account at [dum.ee/signup](https://dum.ee/signup)

### **2. Get API Key**
Generate API key in dashboard: [dum.ee/dashboard/api-keys](https://dum.ee/dashboard/api-keys)

### **3. Make First Request**
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.dum.ee/api/messages \
     -d '{"text":"Hello world!"}'
```

### **4. Explore**
- Try different AI models
- Upload files for analysis
- Explore conversation history
- Monitor usage and billing

---

## 📞 **Support**

**Technical Support**
- **Email**: api-support@dum.ee
- **Documentation**: [dum.ee/docs](https://dum.ee/docs)
- **Status**: [status.dum.ee](https://status.dum.ee)

**Business Inquiries**
- **Sales**: sales@dum.ee
- **Enterprise**: enterprise@dum.ee

---

**🎯 Ready to integrate AI into your application? Start your free trial today!**

*API Version: 1.0 | Last Updated: January 2025*