const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1]; // Get token from 'Bearer <token>'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret
    req.user = decoded; // Attach the decoded user info (e.g., userId, role) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;

