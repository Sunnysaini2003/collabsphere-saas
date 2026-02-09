const pool = require('../../config/mysql');
const { createNotification } = require('../../utils/notify');

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
      `UPDATE tasks SET status=? WHERE id=? AND org_id=?`,
      [status, taskId, orgId]
    );

    // 🔴 emit real-time update
    const io = req.app.get('io');
    io.to(`project_${req.body.project_id}`).emit('task_updated', {
      taskId,
      status
    });

    res.json({ message: 'Task updated live' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, project_id } = req.body || {};

if (!status) {
  return res.status(400).json({ message: 'Status is required' });
}

    const orgId = req.orgId;

    await pool.query(
      `UPDATE tasks SET status=? WHERE id=? AND org_id=?`,
      [status, taskId, orgId]
    );

    // 🔴 get task info
    const [taskRows] = await pool.query(
      'SELECT assigned_to, title FROM tasks WHERE id=?',
      [taskId]
    );

    let assignedUser = null;
    let taskTitle = '';

    if (taskRows.length) {
      assignedUser = taskRows[0].assigned_to;
      taskTitle = taskRows[0].title;

      // save notification
      await createNotification(
        assignedUser,
        orgId,
        `Task "${taskTitle}" status updated to ${status}`
      );
    }

    const io = req.app.get('io');

    // 🔴 project real-time update
    io.to(`project_${project_id}`).emit('task_updated', {
      taskId,
      status
    });

    // 🔴 user notification realtime
    if (assignedUser) {
      io.to(`user_${assignedUser}`).emit('new_notification', {
        message: `Task "${taskTitle}" updated to ${status}`
      });
    }

    res.json({ message: 'Task updated with notification & realtime' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};
