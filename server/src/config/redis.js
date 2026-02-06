
const Redis = require("ioredis");

// const redis = new Redis({
//   host: process.env.REDIS_HOST,
//   port: process.env.REDIS_PORT
// });

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy(times) {
    if (times > 5) {
      console.log("Redis disabled after 5 retries");
      return null;
    }
    return Math.min(times * 100, 2000);
  }
});

redis.on("error", () => {
  console.log("Redis not available, continuing without cache");
});

module.exports = redis;