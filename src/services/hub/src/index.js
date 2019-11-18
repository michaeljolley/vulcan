const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', client => {
  client.on('onChatMessage', payload => {
    io.emit('onChatMessage', payload);
  });

  client.on('newMessage', message => {
    io.emit('newMessage', message);
  });
});

server.listen(80);
