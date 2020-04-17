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
  if (req.body && req.body.message && req.body.user) {
    const user = req.body.user;
    const incomingMessage = req.body.message;

    // We need a second command in the message
    const lowerMessage = incomingMessage.toLocaleLowerCase().trim();
    const words = lowerMessage.split(" ");
    const shamedThemes = [
      "hotdogstand",
      "lasers",
      "powershell",
      "bbbdark",
      "bbblight",
      "bbbgarish",
      "bbbphrakpanda",
      "bbbvue"
    ];

    if (words.length > 1 && shamedThemes.indexOf(words[1]) !== -1) {
      const username = user["display-name"] || user.login;

      let chatMessage = "";
      let proceed = true;

      switch (words[1]) {
        case "hotdogstand":
          chatMessage = `HotDog Stand!?! Shame on you @${username}`;
          break;
        case "lasers":
          if (user.login === "dot_commie") {
            proceed = false;
          }
          chatMessage = `Lasers!?! Shame on you @${username}`;
          break;
        case "powershell":
          chatMessage = `PowerShell ISE!?! Shame on you @${username}`;
          break;
        case "bbbdark":
          chatMessage = `BBB Dark!?! Shame on you @${username}`;
          break;
        case "bbblight":
          chatMessage = `BBB Light!?! Shame on you @${username}`;
          break;
        case "bbbgarish":
          chatMessage = `BBB Garish!?! Shame on you @${username}`;
          break;
        case "bbbgarish":
          chatMessage = `BBB Vue!?! Shame on you @${username}`;
          break;
        case "bbbpoo":
          chatMessage = `BBB Poo!?! Shame on you @${username}`;
          break;
        case "bbbphrakpanda":
          chatMessage = `I see what you're trying to do; using my favorite theme against me. Shame on you @${username}`;
          break;
      }

      if (proceed) {
        const payload = {
          message: chatMessage,
          messageType: "chat", // or 'whisper'
          recipient: null // required when messageType === whisper
        };

        // Send a the sfx to Socket.io
        socket.emit("onSoundEffect", {
          audioFile: "shame.mp3"
        });
        // Send a message to the Socket.io
        socket.emit("newMessage", payload);
      }
    }
  }
};
