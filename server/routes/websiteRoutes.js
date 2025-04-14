const express = require("express");
const websiteRoutes = express.Router();
const { websiteController, websiteget } = require("../controllers/websiteController"); // Import the website controller functions
websiteRoutes.get("/movies", authMiddleware, websiteController); // Route to get all movies
websiteRoutes.get("/movies/:id", authMiddleware, websiteget); // Route to get a specific movie by ID

module.exports = websiteRoutes; // Export the website routes for use in other files
