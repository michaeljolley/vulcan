require('dotenv').config();

const db = require('./db');
const webhook = require('./webhook');
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
    case 'streamStart':
    case 'streamUpdate':
    case 'streamEnd':
    case 'lightChanged':
      await processEvent(event, payload);
      break;
    default:
      break;
  }
});

const processEvent = async (event, payload) => {
  // If we got to this method, we know this is an event
  // we consider for web hooks.

  // See if there are any web hooks in the database for us to send
  // to for this event.
  try {
    const event_webhooks = await db.getWebhooksByEvent(event);

    // If so, for each web hook, post the payload.
    if (event_webhooks && event_webhooks.length > 0) {
      for (let i = 0; i < event_webhooks.length; i++) {
        const wh = event_webhooks[i];
        console.log(`webhook: ${wh.uri} for ${event} event.`);
        await webhook.callWebhook(wh.uri, payload);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

console.log('Webhook service listening to hub');
