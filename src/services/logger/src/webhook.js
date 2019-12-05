const axios = require('axios').default;

const webhook = {
  /**
   * Sends the payload to the specified uri
   * @param {string} uri Uri of the webhook to call
   * @param {object} payload Object to post to webhook uri
   */
  callWebhook: async (uri, payload) => {
    return axios.post(uri, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

module.exports = webhook;
