const axios = require('axios').default;

const func = {
  /**
   * Returns a array of Command/Uri of available
   * chat functions
   */
  getAvailableCommands: async () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${process.env.STREAMFUNCTIONSURL}/api/commands`)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * Sends the message to an Azure Function to process the message
   * @param {string} uri Uri of the function to process the message
   * @param {string} channel Channel the message was seen in
   * @param {UserState} tags UserState object from tmi.js of the message
   * @param {string} message Message sent
   * @param {UserInfo} user User object from user service
   */
  callChatCommand: async (uri, channel, tags, message, user) => {
    return axios.post(
      uri,
      {
        channel,
        tags,
        message,
        user
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

module.exports = func;
