// Load environment variables first
require("dotenv").config();

// Core Modules
const path = require("path");

// External Modules
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Local Modules
const StoreRouter = require("./routes/storeRouter");
const { hostRouter } = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const adminRouter = require("./routes/adminRouter");
const { pageNotFound } = require("./controllers/errors");

// Constants
const DB_PATH = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@clustermain.ewmxp49.mongodb.net/airbnb?retryWrites=true&w=majority&appName=ClusterMain`;
const PORT = process.env.PORT || 3001;

// Initialize App
const app = express();

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "src")));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Session Store
const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mySecretKey", // Store securely in .env
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Routes
app.use(authRouter);
app.use(StoreRouter);
app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
});
app.use("/host", hostRouter);
app.use(adminRouter);

// 404 Handler
app.use(pageNotFound);

// Start Server
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
  });
