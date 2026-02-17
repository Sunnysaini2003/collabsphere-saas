const pool = require('../../config/mysql');
// const { getOrSetCache } = require('../../utils/cache');


// 🔥 CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const orgId = req.orgId;

    if (!orgId) {
      return res.status(403).json({ message: "No orgId found" });
    }

    const [result] = await pool.query(
      `INSERT INTO projects (org_id, name, description, created_by)
       VALUES (?, ?, ?, ?)`,
      [orgId, name, description, req.user.id]
    );

    res.json({
      message: "Project created successfully",
      projectId: result.insertId
    });

  } catch (err) {
    console.log("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Create project failed" });
  }
};



exports.getProjects = async (req, res) => {
  try {
    const orgId = req.orgId;

    const [rows] = await pool.query(
      `SELECT id, name, status, created_at
       FROM projects
       WHERE org_id = ? 
       ORDER BY created_at DESC`,
      [orgId]
    );

    res.json(rows);

  } catch (err) {
    console.log("GET PROJECT ERROR:", err);
    res.status(500).json({ message: "Fetch projects failed" });
  }
};

