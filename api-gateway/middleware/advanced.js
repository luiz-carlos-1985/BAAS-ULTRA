const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

let redisConnected = false;
redisClient.connect()
  .then(() => {
    redisConnected = true;
    console.log('✅ Redis connected');
  })
  .catch((err) => {
    console.warn('⚠️  Redis not available, running without cache:', err.message);
  });

redisClient.on('error', (err) => {
  redisConnected = false;
});

class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

const correlationId = (req, res, next) => {
  req.correlationId = req.headers['x-correlation-id'] || 
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
};

const advancedRateLimit = async (req, res, next) => {
  if (!redisConnected) {
    return next();
  }

  const key = `rate_limit:${req.ip}`;
  const limit = 100;
  const window = 60;

  try {
    const current = await redisClient.incr(key);
    
    if (current === 1) {
      await redisClient.expire(key, window);
    }

    if (current > limit) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retry_after: await redisClient.ttl(key)
      });
    }

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', limit - current);
    next();
  } catch (error) {
    next();
  }
};

const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET' || !redisConnected) {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redisClient.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      res.originalJson = res.json;
      res.json = function(data) {
        redisClient.setEx(key, duration, JSON.stringify(data));
        res.originalJson(data);
      };
      next();
    } catch (error) {
      next();
    }
  };
};

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      correlation_id: req.correlationId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration_ms: duration,
      ip: req.ip
    }));
  });
  
  next();
};

const idempotencyMiddleware = async (req, res, next) => {
  if (req.method === 'GET' || req.method === 'DELETE' || !redisConnected) {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) {
    return next();
  }

  const key = `idempotency:${idempotencyKey}`;

  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    res.originalJson = res.json;
    res.json = function(data) {
      redisClient.setEx(key, 86400, JSON.stringify(data));
      res.originalJson(data);
    };
    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  CircuitBreaker,
  correlationId,
  advancedRateLimit,
  cacheMiddleware,
  requestLogger,
  idempotencyMiddleware
};
