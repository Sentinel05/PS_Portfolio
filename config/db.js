const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js DNS resolver to use Google's public DNS — fixes SRV lookup
// failures on some Windows setups where c-ares can't reach the system resolver
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
