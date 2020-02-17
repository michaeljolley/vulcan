// Until we decide we want to use a real cache like Redis,
// we'll just keep streams in an array and look there first.
let streamCache = [];

const cache = {
  getStream: function(streamDate) {
    return streamCache.find(f => f.streamDate === streamDate);
  },
  storeStream: function(stream) {
    streamCache = streamCache.filter(f => f.streamDate !== stream.streamDate);
    streamCache.push(stream);
  }
};

module.exports = cache;
