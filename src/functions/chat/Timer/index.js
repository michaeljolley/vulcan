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
  //      'message-type'?: "chat" | "action" | "whisper";
  //      username?: string;
  //      bits?: string;
  //    },
  //    message: string,
  //    user: User
  // }

  // We have to have a message to parse in order to do a shout-out.
  if (req.body && req.body.message && req.body.user) {
    
    const stream = req.body.stream;

    if (stream === undefined) return;
    
    const userstate = req.body.userstate;
    const incomingMessage = req.body.message;

    // Only mods or broadcasters can call the shout-out
    // command.
    if (isMod(userstate) || isBroadcaster(userstate)) {

      // We need a second command in the message
      const message = incomingMessage.trim();
      const splitMessage = message.split(" ");

      // We must have more than two parameters '!timer', minutes and the timer's goal
      if (splitMessage.length > 2) {
        const minutes = splitMessage[1];

        const length = minutes * 60 * 1000;
        let goal = '';

        for (let i = 2; i < splitMessage.length; i++) {
          goal = `${goal} ${splitMessage[i]}`;
        }

        const payload = {
          length,
          goal 
        };

        // Send a message to the Socket.io
        socket.emit("onTimerStart", payload);
      }
    }
  }
};

function isMod(userstate) {
  if (userstate && userstate.badges && userstate.badges.moderator) {
    return true;
  }
  return false;
}

function isBroadcaster(userstate) {
  if (userstate && userstate.badges && userstate.badges.broadcaster) {
    return true;
  }
  return false;
}
