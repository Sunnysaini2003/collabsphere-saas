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
