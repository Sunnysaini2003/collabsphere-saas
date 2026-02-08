const pool = require('../config/mysql');

exports.createNotification = async (userId, orgId, message) => {
  await pool.query(
    `INSERT INTO notifications (user_id, org_id, message)
     VALUES (?, ?, ?)`,
    [userId, orgId, message]
  );
};
