module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // join project room
    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
    });

    // send message
    socket.on('send_message', (data) => {
      io.to(`project_${data.projectId}`).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

};
git add .
const Chat = require('../modules/chat/chat.model');

module.exports = (io) => {

  io.on('connection', (socket) => {

    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
    });

    socket.on('send_message', async (data) => {

      // save to MongoDB
      await Chat.create({
        projectId: data.projectId,
        sender: data.sender,
        message: data.message
      });

      io.to(`project_${data.projectId}`).emit('receive_message', data);
    });

  });

};
