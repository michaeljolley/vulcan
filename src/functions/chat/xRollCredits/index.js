const io = require("socket.io-client");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

module.exports = async function(context, req) {
  const streamDate = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Chicago"
  });
  socket.emit("requestCredits", { streamDate });
};
