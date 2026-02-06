const pool = require('../../config/mysql');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const orgId = req.orgId;

    const [result] = await pool.query(
      `INSERT INTO projects (org_id, name, description, created_by)
       VALUES (?, ?, ?, ?)`,
      [orgId, name, description, req.user.id]
    );

    res.json({ message: 'Project created', projectId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create project failed' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const orgId = req.orgId;

    const [rows] = await pool.query(
      `SELECT id, name, status, created_at
       FROM projects
       WHERE org_id = ? AND status = 'ACTIVE'
       ORDER BY created_at DESC`,
      [orgId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetch projects failed' });
  }
};
const { getOrSetCache } = require('../../utils/cache');

exports.getProjects = async (req, res) => {
  try {
    const cacheKey = `projects:${req.orgId}`;

    const data = await getOrSetCache(cacheKey, async () => {
      const [rows] = await pool.query(
        `SELECT id, name, status, created_at
         FROM projects
         WHERE org_id = ? AND status = 'ACTIVE'`,
        [req.orgId]
      );
      return rows;
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetch failed' });
  }
};
