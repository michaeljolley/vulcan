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
      await onChatMessage(payload);
      break;
    case 'onChatMessageWithEmotes':
      await onChatMessageWithEmotes(payload);
      break;
    case 'onCheer':
      await onCheer(payload);
      break;
    case 'onJoin':
      await onJoin(payload);
      break;
    case 'onPart':
      await onPart(payload);
      break;
    case 'onRaid':
      await onRaid(payload);
      break;
    case 'onSubscription':
      await onSubscription(payload);
      break;
    default:
      break;
  }
});

const onChatMessage = async payload => {};
const onChatMessageWithEmotes = async payload => {};
const onCheer = async payload => {};
const onJoin = async payload => {};
const onPart = async payload => {};
const onRaid = async payload => {};
const onSubscription = async payload => {};

console.log('Logger service listening to hub');
