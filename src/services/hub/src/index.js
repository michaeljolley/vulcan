const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.route('/', (req, res) => {
  res.sendStatus(200);
});

io.on('connection', socket => {
  socket.on('onChatMessage', payload => {
    io.emit('onChatMessage', payload);
  });

  socket.on('newMessage', message => {
    io.emit('newMessage', message);
  });
});

server.listen(80);
