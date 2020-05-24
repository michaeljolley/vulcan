const axios = require('axios');
const { getTwitchAccessToken } = require('@jlengstorf/get-twitch-oauth');

const twitchAPIStreamEndpoint = 'https://api.twitch.tv/helix/streams';

require('dotenv').config();

const twitchClientToken = process.env.TWITCHCLIENTTOKEN;
const twitchClientId = process.env.TWITCHCLIENTID;
const twitchClientUserId = process.env.TWITCHCLIENTUSERID;

const api = {
  getStream: async function(streamDate) {
    const { access_token } = await getTwitchAccessToken({
        client_id: twitchClientId,
        client_secret: twitchClientToken,
        grant_type: 'client_credentials',
        scopes: ''
      });
      
    const url = `${twitchAPIStreamEndpoint}?user_id=${twitchClientUserId}&first=1`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      'Client-ID': twitchClientId
    };

    let stream = undefined;

    try {
      const response = await axios.get(url, { headers });
      if (response.data) {
        const body = response.data;
        stream = body.data.length > 1 ? body.data : body.data[0];
        if (stream) {
          stream = {
            id: stream.id,
            started_at: stream.started_at,
            streamDate: streamDate,
            title: stream.title
          };
        }
      }
    } catch (err) {
      console.log(err);
    }

    return stream;
  }
};

module.exports = api;
