const express = require('express'); // Import express for creating the router
const adminRouter = express.Router(); // Create a new router instance
const { signUp, login } = require("../controllers/adminController"); // Import signUp and login functions from the admin controller


adminRouter.post("/signup", signUp); // Route for signing up a new user
adminRouter.post("/login", login); // Route for logging in a user

module.exports =  adminRouter ; // Export the admin router for use in other files