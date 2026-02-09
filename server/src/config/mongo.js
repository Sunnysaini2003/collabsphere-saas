const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,          // 🔥 forces IPv4 (fixes India ISP issue)
      serverSelectionTimeoutMS: 5000
    });

    console.log("MongoDB Atlas Connected");
  } catch (err) {
    console.log("Mongo Error:", err);
  }
};
