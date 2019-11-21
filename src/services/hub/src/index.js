const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.route('/', (req, res) => {
  res.sendStatus(200);
});

io.on('connection', socket => {
  socket.on('onChatMessage', payload => {
    console.log(`onChatMessage: ${JSON.stringify(payload)}`);
    io.emit('onChatMessage', payload);
  });

  socket.on('newMessage', payload => {
    console.log(`newMessage: ${JSON.stringify(payload)}`);
    io.emit('newMessage', payload);
  });
});

http.listen(80, function() {
  console.log('listening in http://localhost:80');
});
