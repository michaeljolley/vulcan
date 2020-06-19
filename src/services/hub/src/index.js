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
  socket.on('onFollow', payload => {
    io.emit('onFollow', payload);
  });
  socket.on('onFollowWebhook', payload => {
    io.emit('onFollowWebhook', payload);
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

  socket.on('streamEnd', () => {
    io.emit('streamEnd');
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
   * Poll commands
   */
  socket.on('pollStart', payload => {
    io.emit('pollStart', payload);
  });
  socket.on('pollStop', payload => {
    io.emit('pollStop', payload);
  });
  socket.on('pollEnd', payload => {
    io.emit('pollEnd', payload);
  });
  socket.on('pollVote', payload => {
    io.emit('pollVote', payload);
  });
  socket.on('pollWinner', payload => {
    io.emit('pollWinner', payload);
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
  socket.on('avStateChanged', payload => {
    io.emit('avStateChanged', payload);
  });
  socket.on('onAnnouncement', payload => {
    io.emit('onAnnouncement', payload);
  });
  socket.on('onCreditRoll', payload => {
    io.emit('onCreditRoll', payload);
  });
  socket.on('requestCredits', payload => {
    io.emit('requestCredits', payload);
  });

  /*
   * PubSub events
   */
  socket.on('pointsRedeemed', payload => {
    io.emit('pointsRedeemed', payload);
  });
  
  /*
   * Timer commands
   */
  socket.on('onTimerStart', payload => {
    io.emit('onTimerStart', payload);
  });

  /*
   * LED commands
   */
  socket.on('lightChanged', payload => {
    io.emit('lightChanged', payload);
  });

  /*
   * Cheer, sub & donation events
   */
  socket.on('onCheer', payload => {
    io.emit('onCheer', payload);
  });

  socket.on('onSubscription', payload => {
    io.emit('onSubscription', payload);
  });

  socket.on('onDonation', payload => {
    io.emit('onDonation', payload);
  })
});

http.listen(80, function() {
  console.log('listening in http://localhost:80');
});
