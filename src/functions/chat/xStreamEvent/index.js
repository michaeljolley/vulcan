const io = require("socket.io-client");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

module.exports = async function(context, req) {
  const event = req.body;

  // {
  //   "data": [
  //      {
  //        "id": "0123456789",
  //        "user_id": "5678",
  //        "user_name": "wjdtkdqhs",
  //        "game_id": "21779",
  //        "community_ids": [],
  //        "type": "live",
  //        "title": "Best Stream Ever",
  //        "viewer_count": 417,
  //        "started_at": "2017-12-01T10:09:45Z",
  //        "language": "en",
  //        "thumbnail_url": "https://link/to/thumbnail.jpg"
  //       }
  //   ]
  // }

  if (event && event.data) {
    if (event.data.length === 0) {
      // if data.length === 0 the stream has ended
      socket.emit("streamEnd");
    } else {
      // if data.length !== 0 the stream has started or changed
      socket.emit("streamUpdate", event.data[0]);
    }
  }

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: req.query["hub.challenge"],
    headers: {
      "Content-Type": "text/plain"
    }
  };
  context.done();
};
