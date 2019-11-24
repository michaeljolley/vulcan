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
  // 'message-type'?: "chat" | "action" | "whisper";
  // username?: string;
  // bits?: string;
  // },
  //    message: string,
  //    user: User
  // }

  // We have to have a message to parse in order to do a shout-out.
  if (req.body && req.body.message && req.body.user) {
    const user = req.body.user;
    const incomingMessage = req.body.message;

    // Only mods or broadcasters can call the shout-out
    // command.
    if (isMod(user) || isBroadcaster(user)) {
      // We need a second command in the message
      const lowerMessage = incomingMessage.toLocaleLowerCase().trim();
      const splitMessage = lowerMessage.split(" ");

      // We must have exactly two parameters '!so' and the user's name
      if (splitMessage.length === 2) {
        const username = splitMessage[1].replace("@", "");

        const message = `Shout out to @${username}!  Check out their stream at https://twitch.tv/${username} and give them a follow.`;

        const payload = {
          message,
          messageType: "chat", // or 'whisper'
          recipient: null // required when messageType === whisper
        };

        // Send a message to the Socket.io
        socket.emit("newMessage", payload);
      }
    }
  }
};

function isMod(user) {
  if (user && user.badges && user.badges.moderator) {
    return true;
  }
  return false;
}

function isBroadcaster(user) {
  if (user && user.badges && user.badges.broadcaster) {
    return true;
  }
  return false;
}
