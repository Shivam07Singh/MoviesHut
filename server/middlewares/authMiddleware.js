const jwt = require("jsonwebtoken");
const jwtPassword = process.env.JWT_SECRET_KEY; // Use a more descriptive name for the secret key

const authMiddleware = (req, res, next) => { 
  const authHeader = req.headers["authorization"];

  // Check if the Authorization header exists
  if (!authHeader) {
    console.error("Authorization header is missing.");
    return res.status(401).json({
      msg: "Unauthorized access: Authorization header is required.",
    });
  }

  // Extract token (supports both 'Bearer <token>' and raw token formats)
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, jwtPassword);

    // Attach admin ID to response locals for further processing
    res.locals.adminId = decoded.id;
    // console.log(`Authenticated Admin ID: ${decoded.id}`);

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);

    // Check for specific error types
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        msg: "Unauthorized access: Token has expired.",
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        msg: "Unauthorized access: Invalid token.",
      });
    }

    // Catch-all for other token errors
    return res.status(401).json({
      msg: "Unauthorized access: Token verification failed.",
    });
  }
}

module.exports = authMiddleware; // Export the middleware function for use in other files
// This middleware function checks for a valid JWT token in the Authorization header of incoming requests.