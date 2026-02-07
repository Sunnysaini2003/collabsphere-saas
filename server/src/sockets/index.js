const Chat = require('../modules/chat/chat.model');

module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // join project room
    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
    });

    // 🔴 chat system
    socket.on('send_message', async (data) => {
      await Chat.create({
        projectId: data.projectId,
        sender: data.sender,
        message: data.message
      });

      io.to(`project_${data.projectId}`).emit('receive_message', data);
    });

    // 🔴 LIVE TASK UPDATE
    socket.on('task_updated', (data) => {
      io.to(`project_${data.projectId}`).emit('task_updated', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

};
