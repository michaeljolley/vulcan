const io = require('socket.io-client');
const TwitchWebhook = require('twitch-webhook');

const patch = require('socketio-wildcard')(io.Manager);
patch(socket);

require('dotenv').config();

const socket = io.connect(process.env.VULCANHUBURL);
const twitchClientUserId = process.env.TWITCHCLIENTID;
const webhookUrl = process.env.VULCANWEBHOOKURL;

// Unsubscribe from Webhooks
// otherwise it will try to send events to a down app
process.on('SIGINT', () => {
  log('info', "I'm going bye-bye");
  unregisterWebhooks();
  process.exit(0);
});

// Whever NODEMON restarts our node process
// We need to kill NGROK otherwise the inspect web doesn't shutdown
process.on('SIGUSR2', () => {
  log('info', "I'm reloading!");
  unregisterWebhooks();
  process.exit(0);
});

const unregisterWebhooks = () => {
  if (twitchFollowerWebhook) {
    twitchFollowerWebhook.unsubscribe('users/follows', {
      first: 1,
      to_id: twitchClientUserId
    });
  }
};

const connectTwitchFollowersWebhook = () => {
  twitchFollowerWebhook = new TwitchWebhook({
    callback: webhookUrl,
    client_id: twitchClientUserId,
    lease_seconds: 43200, // 12 hours
    listen: {
      port: 80
    }
  });

  twitchFollowerWebhook.on('users/follows', handleFollow);

  twitchFollowerWebhook.subscribe('users/follows', {
    first: 1,
    to_id: twitchClientUserId // ID of Twitch Channel
  });

  // renew the subscription when it expires
  twitchFollowerWebhook.on('unsubscribe', obj => {
    twitchFollowerWebhook.subscribe(obj['hub.topic']);
  });
};

const handleFollow = async payload => {
  const event = payload.event;
  if (event && event.data && event.data.length > 0) {
    const followerEvent = {
      followData: event.data
    };
    socket.emit('onFollow', followerEvent);
  }
};

// When we receive an event from the hub service,
// process any associated web hooks.
// socket.on('*', async data => {
//   const event = data.data[0];
//   const payload = data.data[1];

//   switch (event) {
//     default:
//       break;
//   }
// });

connectTwitchFollowersWebhook();

// const webhook = require('./webhook');

// const processEvent = async (event, payload) => {
//   // If we got to this method, we know this is an event
//   // we consider for web hooks.

//   // See if there are any web hooks in the database for us to send
//   // to for this event.
//   try {
//     const event_webhooks = await db.getWebhooksByEvent(event);

//     // If so, for each web hook, post the payload.
//     if (event_webhooks && event_webhooks.length > 0) {
//       for (let i = 0; i < event_webhooks.length; i++) {
//         const wh = event_webhooks[i];
//         console.log(`webhook: ${wh.uri} for ${event} event.`);
//         await webhook.callWebhook(wh.uri, payload);
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
