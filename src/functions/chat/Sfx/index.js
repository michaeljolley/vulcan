const io = require("socket.io-client");
const azure = require("azure-storage");

require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);
const fileService = azure.createFileService();

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
  //     "message": "!sfx",
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

  // We need to get a list of sound clips from storage and
  // return them in a list.

  fileService.listFilesAndDirectoriesSegmented(
    "assets",
    "audio/clips",
    null,
    (err, result) => {
      if (!err && result.entries && result.entries.files.length > 0) {
        const availableEffects = result.entries.files.map(
          m => `${m.name.replace(".mp3", "")}`
        );

        const audioCommands = availableEffects.map(m => `!${m}`).join(", ");
        const message = `The following commands are available as sound effects: ${audioCommands}`;
        const payload = {
          message,
          messageType: "chat", // or 'whisper'
          recipient: null // required when messageType === whisper
        };

        // Send a message to the Socket.io
        socket.emit("newMessage", payload);
      }
    }
  );
};
