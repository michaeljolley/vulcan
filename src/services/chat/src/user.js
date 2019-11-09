const axios = require('axios').default;

/**
 * Returns a user based on the provided Twitch login
 * @param {string} twitchLogin Unique login of the user with Twitch
 */
export async function getUser(twitchLogin) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://user/user/${twitchLogin}`)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}
