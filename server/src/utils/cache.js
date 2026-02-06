const redis = require('../config/redis');

exports.getOrSetCache = async (key, cb, ttl = 60) => {
  const data = await redis.get(key);
  if (data) return JSON.parse(data);

  const freshData = await cb();
  await redis.set(key, JSON.stringify(freshData), 'EX', ttl);
  return freshData;
};
