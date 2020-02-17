const axios = require('axios').default;

const streamService = {
  /**
   * Returns a stream
   */
  getActiveStream: async () => {
    return axios.get(`http://stream/stream/xyz`);
  }
};

module.exports = streamService;
