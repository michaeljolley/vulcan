const axios = require('axios').default;

const func = {
  /**
   * Returns a array of Command/Uri of available
   * chat functions
   */
  getAvailableCommands: async () => {
    const baseChatFunctionUrl = process.env.CHATFUNCTIONSBASEURL;
    return axios.get(`${baseChatFunctionUrl}xAvailableCommands`);
  },

  /**
   * Sends the message to an Azure Function to process the message
   * @param {string} uri Uri of the function to process the message
   * @param {string} channel Channel the message was seen in
   * @param {UserState} tags UserState object from tmi.js of the message
   * @param {string} message Message sent
   * @param {UserInfo} user User object from user service
   * @param {Stream} stream Stream object representing the current stream, if available
   */
  callChatCommand: async (uri, channel, userstate, message, user, stream) => {
    return axios.post(
      uri,
      {
        channel,
        userstate,
        message,
        user,
        stream
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
