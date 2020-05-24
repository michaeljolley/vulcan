const axios = require('axios');
const { getTwitchAccessToken } = require('@jlengstorf/get-twitch-oauth');

const twitchAPIUserEndpoint = 'https://api.twitch.tv/helix/users';

require('dotenv').config();

const twitchClientToken = process.env.TWITCHCLIENTTOKEN;
const twitchClientId = process.env.TWITCHCLIENTID;

const api = {
  getUser: async function(login) {
    const { access_token } = await getTwitchAccessToken({
        client_id: twitchClientId,
        client_secret: twitchClientToken,
        grant_type: 'client_credentials',
        scopes: ''
      });

    const url = `${twitchAPIUserEndpoint}?login=${login}`;

    const headers = {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      'Client-ID': twitchClientId
    };

    let user = undefined;

    try {
      const response = await axios.get(url, { headers });
      if (response.data) {
        const body = response.data;
        user = body.data.length > 1 ? body.data : body.data[0];
        user = {
          id: user.id,
          login: user.login,
          display_name: user.display_name,
          broadcaster_type: user.broadcaster_type,
          profile_image_url: user.profile_image_url
        };
      }
    } catch (err) {
      console.log(err);
    }

    return user;
  }
};

module.exports = api;
