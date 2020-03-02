require("dotenv").config();

const twitchClientId = process.env.TWITCHCLIENTID;
const twitchClientUserId = process.env.TWITCHCLIENTUSERID;
const webhookUrl = process.env.VULCANWEBHOOKURL;

module.exports = async function(context, myTimer) {
  // https://api.twitch.tv/helix/webhooks/hub

  const payload = {
    "hub.callback": `${webhookUrl}`,
    "hub.mode": "subscribe",
    "hub.topic": `https://api.twitch.tv/helix/users/follows?first=1&to_id=${twitchClientUserId}`,
    "hub.lease_seconds": 172800
  };
};
