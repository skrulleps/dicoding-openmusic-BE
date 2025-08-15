const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });

    this._client.on('error', (error) => {
      console.error('Redis Client Error:', error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSeconds = 1800) {
    await this._client.setEx(key, expirationInSeconds, value);
  }

  async get(key) {
    const result = await this._client.get(key);
    return result;
  }

  async delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
