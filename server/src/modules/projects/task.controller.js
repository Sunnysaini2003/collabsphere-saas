const pool = require('../../config/mysql');

exports.createTask = async (req, res) => {
  try {
    const { project_id, title, description, priority, assigned_to, due_date } = req.body;
    const orgId = req.orgId;

    const [result] = await pool.query(
      `INSERT INTO tasks
       (project_id, org_id, title, description, priority, assigned_to, due_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, orgId, title, description, priority, assigned_to, due_date, req.user.id]
    );

    res.json({ message: 'Task created', taskId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create task failed' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const orgId = req.orgId;

    const [rows] = await pool.query(
      `SELECT * FROM tasks
       WHERE project_id = ? AND org_id = ?
       ORDER BY created_at DESC`,
      [projectId, orgId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetch tasks failed' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const orgId = req.orgId;

    await pool.query(
      `UPDATE tasks
       SET status = ?
       WHERE id = ? AND org_id = ?`,
      [status, taskId, orgId]
    );

    res.json({ message: 'Task updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};
