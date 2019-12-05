require('dotenv').config();

const io = require('socket.io-client');
const tmi = require('tmi.js');
const tmiHandlers = require('./tmiHandlers');

const socket = io.connect(process.env.VULCANHUBURL);

const channelName = process.env.TWITCHCLIENTUSERNAME;
const twitchChatClient = new tmi.Client({
  options: { debug: true },
  connections: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCHBOTUSERNAME,
    password: `oauth:${process.env.TWITCHBOTTOKEN}`
  },
  channels: [channelName]
});

// When we receive a new message to send to chat
// from the Socket.IO hub, send it out.
socket.on('newMessage', payload => {
  if (twitchChatClient.readyState() === 'OPEN') {
    if (payload.messageType === 'chat') {
      twitchChatClient.say(channelName, payload.message);
    } else {
      twitchChatClient.whisper(payload.recipient, payload.message);
    }
  }
});

twitchChatClient.on('chat', tmiHandlers.chat);

twitchChatClient.on('cheer', tmiHandlers.cheer);

twitchChatClient.on('giftpaidupgrade', tmiHandlers.giftpaidupgrade);

twitchChatClient.on('raided', tmiHandlers.raided);

twitchChatClient.on('resub', tmiHandlers.resub);

twitchChatClient.on('subgift', tmiHandlers.subgift);

twitchChatClient.on('submysterygift', tmiHandlers.submysterygift);

twitchChatClient.on('subscription', tmiHandlers.subscription);

twitchChatClient.on('join', tmiHandlers.join);

twitchChatClient.on('part', tmiHandlers.part);

twitchChatClient.connect();
