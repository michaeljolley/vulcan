const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.route('/', (req, res) => {
  res.sendStatus(200);
});

io.on('connection', socket => {
  /*
   * Chat message events
   */
  socket.on('onChatMessage', payload => {
    io.emit('onChatMessage', payload);
  });

  socket.on('onChatMessageWithEmotes', payload => {
    io.emit('onChatMessageWithEmotes', payload);
  });

  socket.on('newMessage', payload => {
    io.emit('newMessage', payload);
  });

  /*
   * User events
   */
  socket.on('updateUser', payload => {
    io.emit('updateUser', payload);
  });

  socket.on('refreshUser', payload => {
    io.emit('refreshUser', payload);
  });

  /*
   * Stream events
   */
  socket.on('streamStart', payload => {
    io.emit('streamStart', payload);
  });

  socket.on('streamUpdate', payload => {
    io.emit('streamUpdate', payload);
  });

  socket.on('streamEnd', payload => {
    io.emit('streamEnd', payload);
  });

  socket.on('onRaid', payload => {
    io.emit('onRaid', payload);
  });

  socket.on('onJoin', payload => {
    io.emit('onJoin', payload);
  });

  socket.on('onPart', payload => {
    io.emit('onPart', payload);
  });

  /*
   * AV commands
   */
  socket.on('onSoundEffect', payload => {
    io.emit('onSoundEffect', payload);
  });
  socket.on('stopAudio', payload => {
    io.emit('stopAudio', payload);
  });
  socket.on('avEnabled', payload => {
    io.emit('avEnabled', payload);
  });

  /*
   * LED commands
   */
  socket.on('lightChanged', payload => {
    io.emit('lightChanged', payload);
  });

  /*
   * Cheer & sub events
   */
  socket.on('onCheer', payload => {
    io.emit('onCheer', payload);
  });

  socket.on('onSubscription', payload => {
    io.emit('onSubscription', payload);
  });
});

http.listen(80, function() {
  console.log('listening in http://localhost:80');
});
