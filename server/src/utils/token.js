// generating and refreshing tokens for new users.

const jwt = require('jsonwebtoken');

exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, org_id: user.org_id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};
