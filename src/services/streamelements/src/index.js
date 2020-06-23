const io = require('socket.io-client');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

let JWT = process.env.STREAMELEMENTSJWT;
let HUBURL = process.env.VULCANHUBURL;

const streamElementsSocket = io('https://realtime.streamelements.com', {
    transports: ['websocket']
});

const hubSocket = io(HUBURL);

hubSocket.on('connect', () => {
  console.log('Successfully connected to the Vulcan hub websocket');
})

// Socket connected
streamElementsSocket.on('connect', onConnect);
// Socket got disconnected
streamElementsSocket.on('disconnect', onDisconnect);
// Socket is authenticated
streamElementsSocket.on('authenticated', onAuthenticated);

streamElementsSocket.on('event:test', (data) => {
    data.event.test = true;
    switch (data.listener) {
      case 'tip-latest':
        onDonation(data.event);
    }
});
streamElementsSocket.on('event', (data) => {
    switch (data.type) {
      case 'tip':
        onDonation(data.data);
    }
});
// socket.on('event:update', (data) => {
//   console.log('update');
//     console.log(data);
//     // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update
// });
// socket.on('event:reset', (data) => {
//   console.log('reset');
//     console.log(data);
//     // Structure as on https://github.com/StreamElements/widgets/blob/master/CustomCode.md#on-session-update
// });

function onConnect() {
    console.log('Successfully connected to the StreamElements websocket');
    streamElementsSocket.emit('authenticate', {
        method: 'jwt',
        token: JWT
    });
}

function onDisconnect() {
    console.log('Disconnected from websocket');
    // Reconnect
}

function onAuthenticated(data) {
    const {
        channelId
    } = data;

    console.log(`Successfully connected to channel ${channelId}`);
}

const onDonation = async (data) => {
  try {
    const user = await getUser(data.name);

    if (user) {
      const payload = {
        amount: data.amount,
        message: data.message,
        user
      };
      hubSocket.emit('onDonation', payload)
    }
  }
  catch (err) {
    console.log(err);
  }
}

const getUser = async twitchLogin => {
  return (await axios.get(`http://user/user/${twitchLogin}`)).data;
}