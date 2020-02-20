const axios = require('axios').default;

const userService = {
  /**
   * Returns a user based on the provided Twitch login
   * @param {string} twitchLogin Unique login of the user with Twitch
   */
  getUser: async twitchLogin => {
    return await axios.get(`http://user/user/${twitchLogin}`);
  }
};

module.exports = userService;
