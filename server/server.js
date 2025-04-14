const express = require("express");
const mongoose = require("mongoose"); // Import mongoose for MongoDB connection
const cors = require("cors"); // Import cors for Cross-Origin Resource Sharing
const dotenv = require("dotenv"); // Import dotenv for environment variables
dotenv.config(); // Load environment variables from .env file
const router = express.Router(); // Create a new router instance
const authMiddleware = require("./middlewares/authMiddleware.js"); // Import the authentication middleware
const adminRouter = require("./routes/adminRoutes.js"); // Import the admin router
const websiteRoutes = require("./routes/websiteRoutes.js");

const app = express();
const PORT = process.env.PORT || 8000; // Set the port to listen on, default to 8000 if not specified in .env
app.use(cors({ origin: process.env.CORS_ORIGIN.split(",") })); // Enable CORS for all routes

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(authMiddleware); // Apply authentication middleware to all routes
app.use("/admin", adminRouter ); // Use the admin router for routes starting with /admin
app.use("/website", websiteRoutes); // Use the website router for routes starting with /website

// MongoDB connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
connectDb(); // Call the function to connect to MongoDB

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
