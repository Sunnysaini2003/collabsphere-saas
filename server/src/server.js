const http = require('http');
const { Server } = require('socket.io');

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

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: { origin: "*" }
    });

    require('./sockets')(io);

    server.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  } catch (err) {
    console.error(err);
  }
})();

