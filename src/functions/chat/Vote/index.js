const io = require("socket.io-client");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

module.exports = async function(context, req) {
  // All chat functions will receive a payload of:
  //   {
  //     "channel": "#baldbeardedbuilder",
  //     "userstate": {
  //         "badge-info": {
  //             "subscriber": "12"
  //         },
  //         "badges": {
  //             "broadcaster": "1",
  //             "subscriber": "12",
  //             "sub-gifter": "1"
  //         },
  //         "color": "#D1AC3D",
  //         "display-name": "BaldBeardedBuilder",
  //         "emotes": null,
  //         "flags": null,
  //         "id": "9b4683de-9d41-4f83-97c1-22670c3dcb7f",
  //         "mod": false,
  //         "room-id": "279965339",
  //         "subscriber": true,
  //         "tmi-sent-ts": "1582062215642",
  //         "turbo": false,
  //         "user-id": "279965339",
  //         "user-type": null,
  //         "emotes-raw": null,
  //         "badge-info-raw": "subscriber/12",
  //         "badges-raw": "broadcaster/1,subscriber/12,sub-gifter/1",
  //         "username": "baldbeardedbuilder",
  //         "message-type": "chat"
  //     },
  //     "message": "!so clarkio",
  //     "user": {
  //         "_id": "5e4b06cd7565df3d34232df1",
  //         "login": "baldbeardedbuilder",
  //         "__v": 0,
  //         "profile_image_url": "https://static-cdn.jtvnw.net/jtv_user_pictures/6f44cc26-f33c-46d9-825c-a3c34f8b6327-profile_image-300x300.png",
  //         "broadcaster_type": "affiliate",
  //         "display_name": "BaldBeardedBuilder",
  //         "id": "279965339"
  //     },
  //     "sanitizedMessage": "!ohmy",
  //     "hasCommand": false
  // }

  // We have to have a message to parse in order to do a shout-out.
  if (req.body && req.body.message && req.body.user && req.body.stream) {
    const user = req.body.user;
    const stream = req.body.stream;
    const incomingMessage = req.body.message;

    const lowerMessage = incomingMessage.toLocaleLowerCase().trim();
    const splitMessage = lowerMessage.split(" ");

    // We must have more than one parameter that includes a vote or commands
    // to stop or start the voting
    if (splitMessage.length > 1) {
      const secondWord = splitMessage[1];

      const payload = {
        stream,
        user,
        choice: secondWord
      };

      // Send a message to the Socket.io
      socket.emit("pollVote", payload);
    }
  }
};
