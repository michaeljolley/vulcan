require('dotenv').config();

const log = require('./log');
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
      await log.onChatMessage(payload);
      break;
    case 'onCheer':
      await log.onCheer(payload);
      break;
    case 'onRaid':
      await log.onRaid(payload);
      break;
    case 'onSubscription':
      await log.onSubscription(payload);
      break;
    case 'onFollow':
      await log.onFollow(payload);
      break;
    default:
      break;
  }
});

console.log('Logger service listening to hub');
