require('dotenv').config();

const io = require('socket.io-client');
const WebSocket = require('ws');

const socketIO = io.connect(process.env.VULCANHUBURL);
const userService = require('./user');

const _token = process.env.TWITCHCLIENTTOKEN;
const _url = 'wss://pubsub-edge.twitch.tv';

const twitchSocket = new WebSocket(_url);

const connect = async () => {
  try {
    twitchSocket.onopen = onOpen;

    twitchSocket.onmessage = (event, a) => {
      let data = JSON.parse(event.data);
      onEvent(data);
    };

    twitchSocket.onerror = event => {
      console.log('error', event);
    };

    twitchSocket.onclose = event => {
      console.log('onclose', event);
    };
  } catch (e) {
    console.log(e);
  }
};

const onOpen = () => {
  let message = {
    type: 'LISTEN',
    nonce: nonce(15),
    data: {
      topics: ['channel-points-channel-v1.77504814'],
      auth_token: `${_token}`
    }
  };

  twitchSocket.send(JSON.stringify(message));

  heartbeat();
  heartbeatHandle = setInterval(() => heartbeat(), 60000);
};

const heartbeat = () => {
  let message = {
    type: 'PING'
  };
  twitchSocket.send(JSON.stringify(message));
};

const onEvent = eventData => {
  console.dir(eventData);
  switch (eventData.type) {
    case 'PONG':
      break;
    case 'RESPONSE':
      break;
    case 'MESSAGE':
      if (eventData.data.topic.startsWith('channel-points-channel-v1')) {
        let message = JSON.parse(eventData.data.message);
        handleChannelPoints(message.data.redemption);
      }

      break;
    default:
      console.log(eventData);
      break;
  }
};

const handleChannelPoints = reward => {
  console.dir(reward);

  const username = reward.user.login;

  userService
    .getUser(username)
    .then(user => {
      if (user) {
        const payload = {
          user,
          reward: reward.reward.title,
          message: reward.user_input
        };

        socketIO.emit('pointsRedeemed', payload);
      }
    })
    .catch(err => {
      console.log(`Unable to retrieve user: ${username}`);
    });
};

const nonce = length => {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

connect();

console.log('PubSub listening');
