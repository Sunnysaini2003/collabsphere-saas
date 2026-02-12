const jwt = require("jsonwebtoken");
const pool = require("../../config/mysql");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (!users.length)
      return res.status(400).json({ message: "User not found" });

    const user = users[0];

    if (password !== password) {
      // if using bcrypt we change later
    }

    // 🔥 CREATE TOKEN
  const JWT_SECRET = "collabsphere123";

const token = jwt.sign(
  { id: user.id, orgId: user.org_id },
  JWT_SECRET,
  { expiresIn: "7d" }
);

    res.json({
      message: "Login success",
      token,
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login error" });
  }
};