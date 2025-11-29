const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const compression = require('compression');
const { 
  CircuitBreaker, 
  correlationId, 
  advancedRateLimit, 
  cacheMiddleware, 
  requestLogger,
  idempotencyMiddleware 
} = require('./middleware/advanced');

const app = express();
const PORT = process.env.PORT || 8080;

const circuitBreakers = {};

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('combined'));
app.use(correlationId);
app.use(requestLogger);
app.use(advancedRateLimit);
app.use(idempotencyMiddleware);

// Services URLs
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:8081',
  account: process.env.ACCOUNT_SERVICE_URL || 'http://localhost:8082',
  card: process.env.CARD_SERVICE_URL || 'http://localhost:8083',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:8084',
  kyc: process.env.KYC_SERVICE_URL || 'http://localhost:8085',
  risk: process.env.RISK_SERVICE_URL || 'http://localhost:8086',
  ledger: process.env.LEDGER_SERVICE_URL || 'http://localhost:8087'
};

// Auth middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ultra-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Proxy helper
const proxyRequest = async (service, path, method, data, headers) => {
  try {
    const response = await axios({
      method,
      url: `${SERVICES[service]}${path}`,
      data,
      headers
    });
    return response.data;
  } catch (error) {
    console.error(`Proxy error to ${service}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    throw error.response ? error.response.data : error;
  }
};

// Routes

// Auth routes
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    const result = await proxyRequest('auth', '/auth/register', 'POST', req.body);
    res.json(result);
  } catch (error) {
    console.error('Register error:', error);
    res.status(error.status || 500).json(error);
  }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const result = await proxyRequest('auth', '/auth/login', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

app.post('/api/v1/auth/biometric', async (req, res) => {
  try {
    const result = await proxyRequest('auth', '/auth/biometric', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Account routes (protected)
app.post('/api/v1/accounts', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest('account', '/accounts', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

app.get('/api/v1/accounts/:id', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest('account', `/accounts/${req.params.id}`, 'GET');
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

app.post('/api/v1/accounts/transfer', authenticateToken, async (req, res) => {
  try {
    // Análise de risco antes da transferência
    const riskAssessment = await proxyRequest('risk', '/risk/assess-transaction', 'POST', {
      transaction_id: Date.now().toString(),
      from_account: req.body.from_account_id,
      to_account: req.body.to_account_id,
      amount: req.body.amount
    });

    if (riskAssessment.action === 'block') {
      return res.status(403).json({ 
        error: 'Transaction blocked due to high risk',
        risk_assessment: riskAssessment
      });
    }

    const result = await proxyRequest('account', '/accounts/transfer', 'POST', req.body);
    res.json({ ...result, risk_assessment: riskAssessment });
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Card routes (protected)
app.post('/api/v1/cards', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest('card', '/cards', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

app.get('/api/v1/cards/:id', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest('card', `/cards/${req.params.id}`, 'GET');
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// KYC routes (protected)
app.post('/api/v1/kyc/verify', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest('kyc', '/kyc/verify', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

app.post('/api/v1/kyc/liveness', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest('kyc', '/kyc/liveness', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Risk routes (protected)
app.post('/api/v1/risk/fraud-detection', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest('risk', '/risk/fraud-detection', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

app.post('/api/v1/risk/credit-score', authenticateToken, async (req, res) => {
  try {
    const result = await proxyRequest('risk', '/risk/credit-score', 'POST', req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json(error);
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    time: new Date().toISOString(),
    services: SERVICES
  });
});

// Documentation
app.get('/api/v1/docs', (req, res) => {
  res.json({
    name: 'BaaS Ultra API',
    version: '1.0.0',
    description: 'Banking as a Service - Ultra Disruptivo',
    endpoints: {
      auth: [
        'POST /api/v1/auth/register',
        'POST /api/v1/auth/login',
        'POST /api/v1/auth/biometric'
      ],
      accounts: [
        'POST /api/v1/accounts',
        'GET /api/v1/accounts/:id',
        'POST /api/v1/accounts/transfer'
      ],
      cards: [
        'POST /api/v1/cards',
        'GET /api/v1/cards/:id'
      ],
      kyc: [
        'POST /api/v1/kyc/verify',
        'POST /api/v1/kyc/liveness'
      ],
      risk: [
        'POST /api/v1/risk/fraud-detection',
        'POST /api/v1/risk/credit-score'
      ]
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📚 Documentation: http://localhost:${PORT}/api/v1/docs`);
});
