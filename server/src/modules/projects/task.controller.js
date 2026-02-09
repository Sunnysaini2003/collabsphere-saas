const pool = require('../../config/mysql');
const { createNotification } = require('../../utils/notify');


// 🟢 CREATE TASK
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


// 🟢 GET TASKS
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


// 🔴 UPDATE TASK STATUS + ADMIN + USER NOTIFICATIONS
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, project_id } = req.body || {};
    const orgId = req.orgId;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // 🔴 update task
    await pool.query(
      `UPDATE tasks SET status=? WHERE id=? AND org_id=?`,
      [status, taskId, orgId]
    );

   // 🔴 get task info
const [taskRows] = await pool.query(
  `SELECT assigned_to, title FROM tasks WHERE id=?`,
  [taskId]
);

let assignedUser = null;
let taskTitle = '';

if (taskRows.length) {
  assignedUser = taskRows[0].assigned_to;
  taskTitle = taskRows[0].title;
}

// 🔴admin fetch
const [admins] = await pool.query(
  `SELECT id FROM users 
   WHERE org_id = ? 
   AND role IN ('OWNER','ADMIN')`,
  [orgId]
);

// 🔴 notify assigned user
if (assignedUser) {
  await createNotification(
    assignedUser,
    orgId,
    `Task "${taskTitle}" updated to ${status}`
  );
}

// 🔴 notify admin also
for (let admin of admins) {
  await createNotification(
    admin.id,
    orgId,
    `Task "${taskTitle}" updated to ${status}`
  );
}

    const io = req.app.get('io');

    // 🔴 project realtime update
    io.to(`project_${project_id}`).emit('task_updated', {
      taskId,
      status
    });

    // 🔴 assigned user realtime
    if (assignedUser) {
      io.to(`user_${assignedUser}`).emit('new_notification', {
        message: `Task "${taskTitle}" updated to ${status}`
      });
    }

    // 🔴 admin realtime
    for (let admin of admins) {
      io.to(`user_${admin.id}`).emit('new_notification', {
        message: `Task "${taskTitle}" updated to ${status}`
      });
    }

    res.json({
      message: 'Task updated with admin + user notifications'
    });

  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Update failed' });
  }
};
