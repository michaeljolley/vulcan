const axios = require('axios');

const streamServiceUrl = 'http://stream/stream/';
const userServiceUrl = 'http://user/user/';

const log = {
  onChatMessage: async payload => {
    await sendStreamPayload('chat', payload);
  },
  onCheer: async payload => {
    await sendStreamPayload('cheer', payload);
  },
  onRaid: async payload => {
    await sendStreamPayload('raid', payload);
  },
  onContribution: async payload => {
    await sendStreamPayload('contribution', payload);
  },
  onSubscription: async payload => {
    await sendStreamPayload('subscription', payload);
  },
  onFollow: async payload => {
    await sendStreamPayload('follow', payload);
  },
  onModerator: async payload => {
    await sendStreamPayload('moderator', payload);
  }
};

const sendStreamPayload = async (suffix, payload) => {
  if (payload.stream && payload.stream._id) {
    const url = `${streamServiceUrl}${payload.stream._id.toString()}/${suffix}`;
    await sendPayload(url, payload);
  }
};

const sendUserPayload = async (suffix, payload) => {
  if (payload.user && payload.user.login) {
    await sendPayload(`${userServiceUrl}${payload.user.login}/${suffix}`);
  }
};

const sendPayload = async (url, payload) => {
  await axios.post(url, payload);
};

module.exports = log;
