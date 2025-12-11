// roleMiddleware.js
const authMiddleware = require("./authMiddleware");

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // Comes from authMiddleware after token is decoded

    // Check if the user's role is in the allowed roles list
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: You do not have the required permissions" });
    }

    next(); // User has the required role, proceed
  };
};

module.exports = roleMiddleware;
