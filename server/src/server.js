const app = require('./app');
const connectMongo = require('./config/mongo');
const pool = require('./config/mysql');
require('./config/redis');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('🌐 MySQL Connected');

    await connectMongo();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup Error:', err);
    process.exit(1);
  }
})();
