const pool = require('../../config/mysql');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.createOrg = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  const [result] = await pool.query(
    'INSERT INTO organizations (name, owner_id) VALUES (?, ?)',
    [name, userId]
  );

  await pool.query(
    'UPDATE users SET org_id = ?, role = "OWNER" WHERE id = ?',
    [result.insertId, userId]
  );

  res.json({ message: 'Organization created', orgId: result.insertId });
};

exports.inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const orgId = req.orgId;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    await pool.query(
      `INSERT INTO invites (org_id, email, role, token, expires_at)
       VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 2 DAY))`,
      [orgId, email, role || 'MEMBER', token]
    );

    res.json({
      message: 'Invite created successfully',
      inviteLink: `http://localhost:3000/invite/${token}`
    });
  } catch (err) {
    console.error('Invite Error:', err);
    res.status(500).json({ message: 'Failed to create invite' });
  }
};

exports.validateInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const [rows] = await pool.query(
      `SELECT org_id, email, role, expires_at, status
       FROM invites
       WHERE token = ?`,
      [token]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Invalid invite link' });
    }

    const invite = rows[0];

    if (invite.status === 'ACCEPTED') {
      return res.status(400).json({ message: 'Invite already used' });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Invite expired' });
    }

    res.json({
      org_id: invite.org_id,
      email: invite.email,
      role: invite.role
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Invite validation failed' });
  }
};



exports.acceptInvite = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { token, name, password } = req.body;

    await conn.beginTransaction();

    const [rows] = await conn.query(
      `SELECT org_id, email, role, status, expires_at
       FROM invites
       WHERE token = ? FOR UPDATE`,
      [token]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Invalid invite' });
    }

    const invite = rows[0];

    if (invite.status === 'ACCEPTED') {
      return res.status(400).json({ message: 'Invite already used' });
    }

    if (new Date(invite.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Invite expired' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [userResult] = await conn.query(
      `INSERT INTO users (org_id, name, email, password_hash, role)
       VALUES (?, ?, ?, ?, ?)`,
      [invite.org_id, name, invite.email, hash, invite.role]
    );

    await conn.query(
      `UPDATE invites
       SET status = 'ACCEPTED', used_at = NOW()
       WHERE token = ?`,
      [token]
    );

    await conn.commit();

    res.json({
      message: 'Invite accepted successfully',
      userId: userResult.insertId
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    console.error('INVITE ERROR:', err);
res.status(500).json({
  message: 'Invite acceptance failed',
  error: err.message
});

  } finally {
    conn.release();
  }
};
