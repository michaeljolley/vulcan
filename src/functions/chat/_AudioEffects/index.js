const io = require("socket.io-client");
const azure = require("azure-storage");

require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);
const fileService = azure.createFileService();

module.exports = async function(context, req) {
  // All chat functions will receive a payload of:
  // {
  //    channel: string,
  //    tags: {
  //     badges?: Badges;
  //     color?: string;
  //     "display-name"?: string;
  //     emotes?: { [emoteid: string]: string[] };
  //     id?: string;
  //     mod?: boolean;
  //     turbo?: boolean;
  //     'emotes-raw'?: string;
  //     'badges-raw'?: string;
  //     "room-id"?: string;
  //     subscriber?: boolean;
  //     'user-type'?: "" | "mod" | "global_mod" | "admin" | "staff";
  //     "user-id"?: string;
  //     "tmi-sent-ts"?: string;
  //     flags?: string;
  //     [paramater: string]: any;
  // 'message-type'?: "chat" | "action" | "whisper";
  // username?: string;
  // bits?: string;
  // },
  //    message: string,
  //    user: User
  // }

  // We're essentially getting all chat messages that begin with "!"
  // so we need to check if it happens to be the name of a sound effect.
  if (req.body && req.body.message) {
    const possibleFileName = req.body.message
      .toLowerCase()
      .split(" ")[0]
      .replace("!", "");

    fileService.doesFileExist(
      "assets",
      "audio/clips",
      possibleFileName,
      (err, result, response) => {
        // If no error occurred and the file exists, emit
        // the audio command.
        if (!err && result && result.exists) {
          const payload = {
            audioFile: possibleFileName
          };

          // Send a message to the Socket.io
          socket.emit("onSoundEffect", payload);
        }
      }
    );
  }
};
