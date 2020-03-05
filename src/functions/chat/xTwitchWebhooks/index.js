const axios = require("axios");
const twitchAPIStreamEndpoint = "https://api.twitch.tv/helix/webhooks/hub";

require("dotenv").config();

const twitchClientToken = process.env.TWITCHCLIENTTOKEN;
const twitchClientId = process.env.TWITCHCLIENTID;
const twitchClientUserId = process.env.TWITCHCLIENTUSERID;
const webhookUrl = process.env.VULCANWEBHOOKURL;

const headers = {
  Authorization: `Bearer ${twitchClientToken}`,
  "Content-Type": "application/json",
  "Client-ID": twitchClientId
};

module.exports = async function(context, myTimer) {
  await subscribeToFollowers();
  await subscribeToStreamEvents();
};

/*
 * Subscribe to 'users/follows' endpoint
 */
const subscribeToFollowers = async () => {
  const payload = {
    "hub.callback": `${webhookUrl}/xUserFollow`,
    "hub.mode": "subscribe",
    "hub.topic": `https://api.twitch.tv/helix/users/follows?first=1&to_id=${twitchClientUserId}`,
    "hub.lease_seconds": 172800
  };

  try {
    await axios.post(twitchAPIStreamEndpoint, payload, {
      headers
    });
  } catch (err) {
    context.log(err);
  }
};

/*
 * Subscribe to 'streams' endpoint
 */
const subscribeToStreamEvents = async () => {
  const payload = {
    "hub.callback": `${webhookUrl}/xStreamEvent`,
    "hub.mode": "subscribe",
    "hub.topic": `https://api.twitch.tv/helix/streams?user_id=${twitchClientUserId}`,
    "hub.lease_seconds": 172800
  };

  try {
    await axios.post(twitchAPIStreamEndpoint, payload, {
      headers
    });
  } catch (err) {
    context.log(err);
  }
};
