const io = require("socket.io-client");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

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
  //     'message-type'?: "chat" | "action" | "whisper";
  //     username?: string;
  //     bits?: string;
  // },
  //    message: string,
  //    user: User
  // }

  const message =
    "The Awesum.io project is a new way to spread the love and thank those who may have helped you - help brighten up their day by acknowledging how they've helped you. There is a short video introduction which can be found at https://www.twitch.tv/videos/523855530";

  const payload = {
    message,
    messageType: "chat", // or 'whisper'
    recipient: null // required when messageType === whisper
  };

  // Send a message to the Socket.io
  socket.emit("newMessage", payload);
};
