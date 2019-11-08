const axios = require('axios').default;

/**
 * Returns a array of Command/Uri of available
 * chat functions
 */
export async function getAvailableCommands() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.STREAM_FUNCTIONS_URL}/api/commands`)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * Sends the message to an Azure Function to process the message
 * @param {string} uri Uri of the function to process the message
 * @param {string} channel Channel the message was seen in
 * @param {UserState} tags UserState object from tmi.js of the message
 * @param {string} message Message sent
 * @param {UserInfo} user User object from user service
 */
export async function callChatCommand(uri, channel, tags, message, user) {
  return new Promise((resolve, reject) => {
    axios
      .post(
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
      )
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
