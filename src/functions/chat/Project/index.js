const io = require("socket.io-client");
require("dotenv").config();

const socket = io.connect(process.env.VULCANHUBURL);

module.exports = async function(context, req) {
  // All chat functions will receive a payload of:
  // {
  //    channel: string,
  //    userstate: {
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
  if (req.body && req.body.message && req.body.user && req.body.stream) {
    const user = req.body.user;
    const stream = req.body.stream;

    if (stream === undefined) return;
    
    const username = user.display_name || user.login;

    const message = `@${username}, today's topic is: ${stream.title}`;

    const payload = {
      message,
      messageType: "chat", // or 'whisper'
      recipient: null // required when messageType === whisper
    };

    // Send a message to the Socket.io
    socket.emit("newMessage", payload);
  }
};
