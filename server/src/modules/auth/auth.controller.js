
const bcrypt = require('bcrypt');
const pool = require('../../config/mysql');
const { generateAccessToken, generateRefreshToken } = require('../../utils/token');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, hash]
  );

  res.json({ message: 'User created', userId: result.insertId });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (!rows.length) return res.status(401).json({ message: 'User not found' });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: 'Wrong password' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await pool.query(
    'INSERT INTO sessions (user_id, refresh_token, device, ip_address, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
    [user.id, refreshToken, req.headers['user-agent'], req.ip]
  );

  res.json({ accessToken, refreshToken });
};
