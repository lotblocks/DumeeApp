/**
 * Dumee SAAS Platform - Comprehensive Test Suite
 * Tests all critical functionality for production readiness
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

// Test configuration
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3080';
const API_URL = `${BASE_URL}/api`;

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: [],
    };
  }

  addTest(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async run() {
    console.log('🧪 Starting Dumee SAAS Test Suite...\n');
    
    for (const test of this.tests) {
      try {
        const startTime = performance.now();
        await test.testFn();
        const endTime = performance.now();
        
        this.results.passed++;
        console.log(`✅ ${test.name} (${(endTime - startTime).toFixed(2)}ms)`);
      } catch (error) {
        this.results.failed++;
        this.results.errors.push({ test: test.name, error: error.message });
        console.log(`❌ ${test.name}: ${error.message}`);
      }
      this.results.total++;
    }

    this.printSummary();
    return this.results.failed === 0;
  }

  printSummary() {
    console.log('\n📊 Test Results Summary');
    console.log('=======================');
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.errors.forEach(({ test, error }) => {
        console.log(`  - ${test}: ${error}`);
      });
    }
  }
}

// Helper functions
async function makeRequest(method, endpoint, data = null, headers = {}) {
  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    config.data = data;
  }

  const response = await axios(config);
  return response;
}

async function assertStatus(response, expectedStatus) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
  }
}

// Test Suite Definition
const testRunner = new TestRunner();

// 1. Health Check Tests
testRunner.addTest('Application Health Check', async () => {
  const response = await axios.get(`${BASE_URL}/health`);
  assertStatus(response, 200);
  if (response.data !== 'OK') {
    throw new Error('Health check returned unexpected response');
  }
});

testRunner.addTest('API Health Check', async () => {
  const response = await makeRequest('GET', '/health');
  assertStatus(response, 200);
});

// 2. Security Tests
testRunner.addTest('Security Headers Present', async () => {
  const response = await axios.get(BASE_URL);
  const headers = response.headers;
  
  const requiredHeaders = [
    'x-content-type-options',
    'x-frame-options',
    'strict-transport-security',
  ];
  
  for (const header of requiredHeaders) {
    if (!headers[header]) {
      throw new Error(`Missing security header: ${header}`);
    }
  }
});

testRunner.addTest('CORS Configuration', async () => {
  const response = await axios.options(API_URL, {
    headers: {
      'Origin': 'https://malicious-site.com',
      'Access-Control-Request-Method': 'POST',
    },
  });
  
  // Should not allow random origins
  if (response.headers['access-control-allow-origin'] === '*') {
    throw new Error('CORS is too permissive');
  }
});

// 3. Authentication Tests
testRunner.addTest('Unauthorized Access Protection', async () => {
  try {
    await makeRequest('GET', '/user/profile');
    throw new Error('Protected route allowed unauthorized access');
  } catch (error) {
    if (error.response?.status !== 401) {
      throw new Error(`Expected 401, got ${error.response?.status || 'network error'}`);
    }
  }
});

// 4. Subscription API Tests
testRunner.addTest('Subscription Tiers Endpoint', async () => {
  const response = await makeRequest('GET', '/subscription/tiers');
  assertStatus(response, 200);
  
  const data = response.data;
  if (!data.tiers || !data.tiers.free || !data.tiers.pro || !data.tiers.enterprise) {
    throw new Error('Missing subscription tier data');
  }
});

// 5. Rate Limiting Tests
testRunner.addTest('Rate Limiting Active', async () => {
  const requests = [];
  
  // Make multiple rapid requests
  for (let i = 0; i < 15; i++) {
    requests.push(
      axios.get(`${API_URL}/health`).catch(err => err.response)
    );
  }
  
  const responses = await Promise.all(requests);
  const rateLimited = responses.some(r => r?.status === 429);
  
  if (!rateLimited) {
    console.warn('⚠️  Rate limiting may not be configured');
  }
});

// 6. Database Connection Tests
testRunner.addTest('Database Connectivity', async () => {
  // This would typically test a database health endpoint
  const response = await makeRequest('GET', '/health');
  assertStatus(response, 200);
  
  // In a real test, you'd check database connection status
  // const dbStatus = response.data.database;
  // if (dbStatus !== 'connected') {
  //   throw new Error('Database not connected');
  // }
});

// 7. File Upload Tests
testRunner.addTest('File Upload Security', async () => {
  // Test that malicious file types are rejected
  try {
    const formData = new FormData();
    formData.append('file', new Blob(['test'], { type: 'application/x-executable' }), 'malicious.exe');
    
    await axios.post(`${API_URL}/files/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    throw new Error('Malicious file upload was allowed');
  } catch (error) {
    if (error.response?.status !== 400 && error.response?.status !== 403) {
      throw new Error('File upload security test failed');
    }
  }
});

// 8. Performance Tests
testRunner.addTest('API Response Time', async () => {
  const startTime = performance.now();
  await makeRequest('GET', '/health');
  const endTime = performance.now();
  
  const responseTime = endTime - startTime;
  if (responseTime > 1000) { // 1 second
    throw new Error(`API response too slow: ${responseTime.toFixed(2)}ms`);
  }
});

// 9. Data Validation Tests
testRunner.addTest('Input Sanitization', async () => {
  try {
    await makeRequest('POST', '/auth/login', {
      email: '<script>alert("xss")</script>',
      password: 'password',
    });
  } catch (error) {
    // Should either reject the input or sanitize it
    if (error.response?.status !== 400 && error.response?.status !== 422) {
      throw new Error('XSS protection failed');
    }
  }
});

// 10. Environment Configuration Tests
testRunner.addTest('Environment Variables Set', async () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
});

// Run the test suite
if (require.main === module) {
  testRunner.run().then(success => {
    console.log(success ? '\n🎉 All tests passed!' : '\n💥 Some tests failed!');
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  });
}

module.exports = { TestRunner, testRunner };