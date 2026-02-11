

const http = require('http');
const app = require('./app');
const pool = require('./config/mysql');
const express = require("express");
const cors = require("cors");
const connectMongo = require('./config/mongo');
require('./config/redis');

const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // MySQL check
    await pool.query('SELECT 1');
    console.log('MySQL Connected');

    // Mongo connect
    await connectMongo();

    // 🔴 create HTTP server FIRST
    const server = http.createServer(app);

    // 🔴 then socket.io
    const io = new Server(server, {
      cors: { origin: "*" }
    });

    // make io global
    app.set('io', io);

    // socket handler
    require('./sockets')(io);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Startup Error:', err);
  }
})();
