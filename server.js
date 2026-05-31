const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

//dotenv configuration
dotenv.config();

//connect to MongoDB then upsert admin credentials from env on every start
connectDB().then(async () => {
  try {
    const Admin = require("./models/Admin");
    if (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) {
      const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await Admin.findOneAndUpdate(
        {},
        { username: process.env.ADMIN_USERNAME, passwordHash },
        { upsert: true, new: true }
      );
      console.log("Admin credentials synced from environment variables");
    }
  } catch (err) {
    console.error("Admin seed error:", err.message);
  }
});

//rest object
const app = express();

//middlewares
app.set("trust proxy", 1); // trust first proxy (Render, etc.) for accurate IP rate limiting
app.use(cors());
app.use(express.json());

//static files
app.use(express.static(path.join(__dirname, "./client/build")));

//routes
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/ps-portfolio", require("./routes/portfolioRoutes"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
