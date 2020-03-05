const io = require("socket.io-client");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

module.exports = async function(context, req) {
  const event = req.body;

  if (event && event.data && event.data.length > 0) {
    socket.emit("onFollowWebhook", event);
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
