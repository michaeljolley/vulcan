require('dotenv').config();

const tmi = require('tmi.js');
const tmiHandlers = require('./tmiHandlers');
const userService = require('./user');

const io = require('socket.io-client');
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

socket.on('onFollowWebhook', async payload => {
  //   {
  //     "data":
  //        [{
  //           "from_id":"1336",
  //           "from_name":"ebi",
  //           "to_id":"1337",
  //           "to_name":"oliver0823nagy",
  //           "followed_at": "2017-08-22T22:55:24Z"
  //        }]
  //  }
  if (payload && payload.data && payload.data.length > 0) {
    const follower = await userService.getUser(payload.data[0].from_name);
    if (follower) {
      const followPayload = {
        user: follower
      };
      socket.emit('onFollow', followPayload);
    }
  }
});

twitchChatClient.on('chat', (channel, userstate, message, self) => {
  tmiHandlers.chat(channel, userstate, message, self, socket);
});

twitchChatClient.on('cheer', (channel, userstate, message) => {
  tmiHandlers.cheer(channel, userstate, message, socket);
});

twitchChatClient.on(
  'giftpaidupgrade',
  (channel, username, sender, userstate) => {
    tmiHandlers.giftpaidupgrade(channel, username, sender, userstate, socket);
  }
);

twitchChatClient.on('raided', (channel, username, viewers) => {
  tmiHandlers.raided(channel, username, viewers, socket);
});

twitchChatClient.on(
  'resub',
  (channel, username, months, message, userstate, methods) => {
    tmiHandlers.resub(
      channel,
      username,
      months,
      message,
      userstate,
      methods,
      socket
    );
  }
);

twitchChatClient.on(
  'subgift',
  (channel, username, streakMonths, recipient, methods, userstate) => {
    tmiHandlers.subgift(
      channel,
      username,
      streakMonths,
      recipient,
      methods,
      userstate,
      socket
    );
  }
);

twitchChatClient.on(
  'submysterygift',
  (channel, username, numbOfSubs, methods, userstate) => {
    tmiHandlers.submysterygift(
      channel,
      username,
      numbOfSubs,
      methods,
      userstate,
      socket
    );
  }
);

twitchChatClient.on(
  'subscription',
  (channel, username, method, message, userstate) => {
    tmiHandlers.subscription(
      channel,
      username,
      method,
      message,
      userstate,
      socket
    );
  }
);

twitchChatClient.on('join', (channel, username, self) => {
  tmiHandlers.join(channel, username, self, socket);
});

twitchChatClient.on('part', (channel, username, self) => {
  tmiHandlers.part(channel, username, self, socket);
});

twitchChatClient.connect();
