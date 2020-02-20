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

  // We have to have a user in order to do an FX stop
  if (req.body && req.body.userstate) {
    const user = req.body.userstate;

    // Only mods or broadcasters can call the stop command.
    if (isMod(user) || isBroadcaster(user)) {
      const payload = req.body;

      // Send a message to the Socket.io
      socket.emit("stopAudio", payload);
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
