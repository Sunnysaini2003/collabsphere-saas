// authorizing tokens
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token' });

  try {
    const JWT_SECRET = "collabsphere123";
const decoded = jwt.verify(token, JWT_SECRET);
req.user = decoded;
next();
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
