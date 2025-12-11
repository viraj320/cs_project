const jwt = require('jsonwebtoken');

// Optional auth: if Authorization header with Bearer token is present, verify and attach req.user.
// If no token is present, simply call next(). If token is present but invalid, return 401.
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
