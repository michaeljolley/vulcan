require('dotenv').config();

const db = require('./db');
const io = require('socket.io-client');

const socket = io.connect(process.env.VULCANHUBURL);

const patch = require('socketio-wildcard')(io.Manager);
patch(socket);

// When we receive an event from the hub service,
// process any associated web hooks.
socket.on('*', async data => {
  const event = data.data[0];
  const payload = data.data[1];

  switch (event) {
    case 'onChatMessage':
      await db.onChatMessage(payload);
      break;
    case 'onChatMessageWithEmotes':
      await db.onChatMessageWithEmotes(payload);
      break;
    case 'onCheer':
      await db.onCheer(payload);
      break;
    case 'onJoin':
      await db.onJoin(payload);
      break;
    case 'onPart':
      await db.onPart(payload);
      break;
    case 'onRaid':
      await db.onRaid(payload);
      break;
    case 'onSubscription':
      await db.onSubscription(payload);
      break;
    default:
      break;
  }
});

console.log('Logger service listening to hub');
